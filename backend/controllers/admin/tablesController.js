const TableService = require("../../services/admin/tableService");

exports.createTable = async (req, res) => {
  try {
    const table = await TableService.createTableWithSector(req.body);
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Otros métodos del controlador...
