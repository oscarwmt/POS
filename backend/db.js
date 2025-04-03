const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "pos-db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "Ticex2021",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);

// Importar modelos
const Categoria = require("./models/Categoria")(sequelize, Sequelize.DataTypes);
const Producto = require("./models/Producto")(sequelize, Sequelize.DataTypes);
const Cliente = require("./models/Cliente")(sequelize, Sequelize.DataTypes);
const Venta = require("./models/Venta")(sequelize, Sequelize.DataTypes);
const DetalleVenta = require("./models/DetalleVenta")(
  sequelize,
  Sequelize.DataTypes
);
const Sector = require("./models/Sector")(sequelize, Sequelize.DataTypes);
const Mesa = require("./models/Mesa")(sequelize, Sequelize.DataTypes);
const Pedido = require("./models/Pedido")(sequelize, Sequelize.DataTypes);
const PedidoProducto = require("./models/PedidoProducto")(
  sequelize,
  Sequelize.DataTypes
);
const Proveedor = require("./models/Proveedor")(sequelize, Sequelize.DataTypes);
const Compra = require("./models/Compra")(sequelize, Sequelize.DataTypes);
const MovimientoInventario = require("./models/MovimientoInventario")(
  sequelize,
  Sequelize.DataTypes
);

// Configurar relaciones
// (Las relaciones ya están definidas en cada modelo)

module.exports = {
  sequelize,
  Categoria,
  Producto,
  Cliente,
  Venta,
  DetalleVenta,
  Sector,
  Mesa,
  Pedido,
  PedidoProducto,
  Proveedor,
  Compra,
  MovimientoInventario,
};
