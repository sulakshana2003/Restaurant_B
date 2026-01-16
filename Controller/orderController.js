import db from "../Models/index.js";

const {
  sequelize,
  OpenAccount,
  Order,
  OrderItem,
  MenuItem,
  RestaurantTable,
  Customer,
} = db;

function makeOrderNumber(prefix = "ORD") {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${yyyy}${mm}${dd}-${rand}`;
}

export const placeOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { openAccountId, items } = req.body;

    if (!openAccountId || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "openAccountId and items[] are required" });
    }

    const openAcc = await OpenAccount.findByPk(openAccountId, {
      include: [{ model: RestaurantTable }, { model: Customer }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!openAcc) {
      await t.rollback();
      return res.status(404).json({ error: "OpenAccount not found" });
    }
    if (!openAcc.IsOpen) {
      await t.rollback();
      return res.status(400).json({ error: "OpenAccount is closed" });
    }

    const normalized = items
      .map((x) => ({
        menuItemId: Number(x.menuItemId),
        qty: Number(x.qty || 0),
        orderType: String(x.orderType || "").toUpperCase(),
        note: x.note ? String(x.note) : null,
      }))
      .filter(
        (x) =>
          x.menuItemId &&
          x.qty > 0 &&
          (x.orderType === "DI" || x.orderType === "TA")
      );

    if (normalized.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: "No valid items to place" });
    }

    const menuIds = [...new Set(normalized.map((x) => x.menuItemId))];
    const menuItems = await MenuItem.findAll({
      where: { Id: menuIds },
      transaction: t,
    });

    const menuMap = new Map(menuItems.map((m) => [Number(m.Id), m]));

    const byType = normalized.reduce((acc, it) => {
      acc[it.orderType] = acc[it.orderType] || [];
      acc[it.orderType].push(it);
      return acc;
    }, {});

    const createdOrders = [];

    for (const orderType of Object.keys(byType)) {
      const group = byType[orderType];

      let totalAmount = 0;

      const orderItemRows = group.map((it) => {
        const mi = menuMap.get(it.menuItemId);
        if (!mi) {
          throw new Error(`MenuItem not found: ${it.menuItemId}`);
        }

        const price = Number(mi.SellingPrice || 0);
        totalAmount += price * it.qty;

        const stationId = Number(mi.TargetSectionId || mi.SectionId || 1);

        return {
          MenuItemId: it.menuItemId,
          StationId: stationId,
          Quantity: it.qty,
          Note: it.note,
          ItemStatus: "Pending",
        };
      });

      const newOrder = await Order.create(
        {
          OrderNumber: makeOrderNumber("ORD"),
          TableId: openAcc.TableId ?? null,
          CustomerId: openAcc.CustomerId ?? null,
          OpenAccountId: openAcc.Id,
          OrderType: orderType, // "DI" or "TA"
          OrderStatus: "PROCESSING",
          TotalAmount: totalAmount,
          OrderDate: new Date(),
        },
        { transaction: t }
      );

      await OrderItem.bulkCreate(
        orderItemRows.map((r) => ({ ...r, OrderId: newOrder.Id })),
        { transaction: t }
      );

      const full = await Order.findByPk(newOrder.Id, {
        include: [
          {
            model: OrderItem,
            include: [{ model: MenuItem }], // optional but super useful
          },
        ],
        transaction: t,
      });

      createdOrders.push(full);
    }

    await t.commit();
    return res.status(201).json({
      openAccountId: openAcc.Id,
      createdOrders,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to place order" });
  }
};

export const cancelOrderItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { orderItemId } = req.params;

    const item = await OrderItem.findByPk(orderItemId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: "OrderItem not found" });
    }

    if (item.ItemStatus === "Cancelled" || item.ItemStatus === "Completed") {
      await t.rollback();
      return res.status(400).json({ error: "Item cannot be cancelled" });
    }

    item.ItemStatus = "Cancelled";
    await item.save({ transaction: t });

    await t.commit();
    res.json({ success: true, item });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: "Failed to cancel item" });
  }
};
