import e from "express";
import db from "../Models/index.js";

const { OrderItem, Order, OpenAccount, RestaurantTable, MenuItem, Section } =
  db;

export const getMonitorItems = async (req, res) => {
  try {
    const section = req.query.section || "Kitchen";
    const status = req.query.status || "Finished";

    const rows = await OrderItem.findAll({
      where: {
        ItemStatus: status, // ✅ correct column
      },
      include: [
        {
          model: Section,
          required: true,
          where: { SectionName: section },
        },
        {
          model: MenuItem,
          required: true,
          attributes: ["Id", "ItemName"],
        },
        {
          model: Order,
          required: true,
          attributes: ["Id"],
          include: [
            {
              model: OpenAccount,
              required: true,
              where: { IsOpen: true },
              include: [
                {
                  model: RestaurantTable,
                  required: true,
                  attributes: ["Id", "TableName"],
                },
              ],
            },
          ],
        },
      ],
      order: [
        [Order, OpenAccount, RestaurantTable, "TableName", "ASC"],
        ["Id", "ASC"],
      ],
    });

    // Group by table
    const result = {};
    for (const r of rows) {
      const table = r.Order.OpenAccount.RestaurantTable;
      const tableId = table.Id;

      if (!result[tableId]) {
        result[tableId] = {
          TableId: table.Id,
          TableName: table.TableName,
          Items: [],
        };
      }

      result[tableId].Items.push({
        OrderItemId: r.Id,
        OrderId: r.OrderId,
        ItemName: r.MenuItem.ItemName,
        Quantity: r.Quantity,
        ItemStatus: r.ItemStatus,
        Note: r.Note,
      });
    }

    return res.json(Object.values(result));
  } catch (err) {
    console.error("Steward monitor error:", err);
    return res
      .status(500)
      .json({ message: "Failed to load steward items", error: err.message });
  }
};

// finished --> served

export const serveOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await db.OrderItem.findByPk(id, {
      include: [
        {
          model: db.Order,
          required: true,
          include: [
            { model: db.OpenAccount, required: true, where: { IsOpen: true } },
          ],
        },
      ],
    });

    if (!item) return res.status(404).json({ message: "Order item not found" });

    if (item.ItemStatus !== "Pending") {
      return res.status(400).json({
        message: `Cannot serve item in status ${item.ItemStatus}`,
      });
    }

    item.ItemStatus = "Served";
    await item.save();

    return res.json({
      message: "OK",
      OrderItemId: item.Id,
      Status: item.Status,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to serve item", error: err.message });
  }
};
