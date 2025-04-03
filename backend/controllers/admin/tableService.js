const { Table, Sector } = require("../../models");

class TableService {
  static async createTableWithSector(tableData) {
    let { sector, ...table } = tableData;

    // Si el sector es nuevo (se envió como string)
    if (typeof sector === "string") {
      const newSector = await Sector.create({ nombre: sector });
      table.sector_id = newSector.id;
    } else {
      table.sector_id = sector;
    }

    return await Table.create(table);
  }
}

module.exports = TableService;
