import customer from "../Models/customer.js";
import db from "../Models/index.js";
const { OpenAccount, Customer, Order, RestaurantTable } = db;

export const startOpenAccount = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { tableId, telephoneNo } = req.body;

    if (!tableId || !telephoneNo) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "TableId and telephoneNo are required" });
    }

    const table = await RestaurantTable.findByPk(tableId);
    if (!table) {
      await t.rollback();
      return res.status(404).json({ error: "Table not found" });
    }

    const existingOpenAccount = await OpenAccount.findOne({
      where: { TableId: tableId, IsOpen: true },
      include: [{ model: Customer }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (existingOpenAccount) {
      await t.commit();
      return res.json({
        reused: true,
        openAccountId: existingOpenAccount.Id,
        customer: existingOpenAccount.Customer
          ? {
              Id: existingOpenAccount.Customer.Id,
              CustomerName: existingOpenAccount.Customer.CustomerName,
              TelephoneNo: existingOpenAccount.Customer.TelephoneNo,
            }
          : null,
      });
    }
    //find or create customer
    let customer = await Customer.findOne({
      where: { TelephoneNo: telephoneNo },
      transaction: t,
    });
    if (!customer) {
      customer = await Customer.create(
        {
          TelephoneNo: telephoneNo,
        },
        { transaction: t }
      );
    }
    // openAccount creation
    const newOpenAccount = await OpenAccount.create(
      {
        TableId: tableId,
        CustomerId: customer.Id,
        TelephoneNo: telephoneNo,
        IsOpen: true,
        OpenedAt: new Date(),
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({
      openAccountId: newOpenAccount.Id,
      customer: {
        Id: customer.Id,
        TelephoneNo: customer.TelephoneNo,
      },
    });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ error: "An error occurred while starting the open account" });
  }
};

export const getOpenAccount = async (req, res) => {
  try {
    const openAcc = await OpenAccount.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: Order },
        { model: RestaurantTable },
      ],
    });
    if (!openAcc) {
      return res.status(404).json({ error: "OpenAccount not found" });
    }
    res.status(200).json(openAcc);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the open account" });
  }
};

export const getOrdersByOpenAccount = async (req, res) => {
  try {
    const openAccountId = req.params.openAccountId;

    const orders = await Order.findAll({
      where: { OpenAccountId: openAccountId },
      order: [["Id", "DESC"]],
      include: [
        {
          model: OrderItem,
          include: [{ model: MenuItem }],
        },
      ],
    });

    return res.json({ openAccountId, orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};
