import { or } from "sequelize";
import db from "../Models/index.js";
import customer from "../Models/customer.js";

export const listTables = async (req, res) => {
  try {
    const tables = await db.RestaurantTable.findAll({
      order: [["TableName", "ASC"]],
      include: [
        {
          model: db.OpenAccount,
          where: { IsOpen: true },
          required: false,
          include: [{ model: db.Customer }],
        },
      ],
    });

    const mapped = tables.map((table) => ({
      Id: table.Id,
      TableName: table.TableName,
      Capacity: table.Capacity,
      CurrentStatus: table.CurrentStatus,
      hasOpenAccount: table.OpenAccounts?.length > 0,
      OpenAccount:
        table.OpenAccounts?.length > 0
          ? {
              Id: table.OpenAccounts[0]?.Id,
              TelephoneNo: table.OpenAccounts?.[0]?.TelephoneNo,
              Customer: table.OpenAccounts?.[0]?.Customer
                ? {
                    Id: table.OpenAccounts[0].Customer.Id,
                    CustomerName: table.OpenAccounts[0].Customer.CustomerName,
                    TelephoneNo: table.OpenAccounts[0].Customer.TelephoneNo,
                  }
                : null,
            }
          : null,
    }));
    console.log(mapped);
    res.status(200).json(mapped);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch tables", details: error.message });
  }
};

export const tableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const openAcc = await db.OpenAccount.findOne({
      where: { TableId: tableId, IsOpen: true },
      include: [{ model: db.Customer }, { model: db.Order }],
      order: [[db.Order, "Id", "Desc"]],
    });

    if (!openAcc) {
      return res.status(200).json({
        hasOpenAccount: false,
        openAccountId: null,
        customer: null,
        orders: [],
      });
    }
    return res.status(200).json({
      hasOpenAccount: true,
      OpenAccount: {
        Id: openAcc.Id,
        TelephoneNo: openAcc.TelephoneNo,
        Customer: openAcc.Customer,
        tableId: openAcc.TableId,
        customerId: openAcc.CustomerId,
      },
      customer: openAcc.Customer
        ? {
            Id: openAcc.Customer.Id,
            CustomerName: openAcc.Customer.CustomerName,
            phone: openAcc.Customer.TelephoneNo,
          }
        : null,
      orders: (openAcc.Orders ?? []).map((order) => ({
        Id: order.Id,
        TotalAmount: order.TotalAmount,
        OrderStatus: order.OrderStatus,
        OrderType: order.OrderType,
        OrderDate: order.OrderDate,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch table status", details: error.message });
  }
};
