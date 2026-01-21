import db from "../Models/index.js";

const { OpenAccount, Order, OrderItem, MenuItem, RestaurantTable, Section } =
  db;

export const getMonitorItems = async (req, res) => {
  try {
    const { section, status, tableId } = req.query;

    // OrderItem filters
    const whereItem = {};
    if (status) whereItem.Status = status;

    // OpenAccount filters (ONLY open accounts)
    const whereOpen = { IsOpen: true };
    if (tableId) whereOpen.TableId = tableId;

    const rows = await OrderItem.findAll({
      where: whereItem,
      include: [
        {
          model: Section,
          required: true,
          ...(section ? { where: { SectionName: section } } : {}),
        },
        {
          model: MenuItem,
          required: true,
          attributes: ["Id", "ItemName"],
        },
        {
          model: Order,
          required: true,
          attributes: ["Id", "OrderNo", "CreatedAt"],
          include: [
            {
              model: OpenAccount,
              required: true,
              where: whereOpen,
              attributes: ["Id", "IsOpen", "TableId"],
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
        ["CreatedAt", "ASC"],
      ],
    });

    // Group by table
    const grouped = {};
    for (const r of rows) {
      const table = r.Order?.OpenAccount?.RestaurantTable;
      const key = table?.Id ?? "unknown";

      if (!grouped[key]) {
        grouped[key] = {
          TableId: table?.Id ?? null,
          TableName: table?.TableName ?? "Unknown",
          Items: [],
        };
      }

      grouped[key].Items.push({
        OrderItemId: r.Id,
        OrderId: r.OrderId,
        OrderNo: r.Order?.OrderNo,
        MenuItemId: r.MenuItemId,
        ItemName: r.MenuItem?.ItemName,
        Qty: r.Qty,
        Status: r.Status,
        Section: r.Section?.SectionName,
        CreatedAt: r.CreatedAt,
      });
    }

    return res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load monitor items" });
  }
};
