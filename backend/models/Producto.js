module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define(
    "Producto",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      codigo_barras: {
        type: DataTypes.STRING,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      imagen: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "productos",
      timestamps: true,
    }
  );

  Producto.associate = (models) => {
    Producto.belongsTo(models.Categoria, {
      foreignKey: "categoria_id",
      as: "categoria",
    });
    Producto.hasMany(models.DetalleVenta, {
      foreignKey: "producto_id",
      as: "detalles_venta",
    });
    Producto.hasMany(models.MovimientoInventario, {
      foreignKey: "producto_id",
      as: "movimientos",
    });
    Producto.hasMany(models.PedidoProducto, {
      foreignKey: "producto_id",
      as: "pedidos_productos",
    });
  };

  return Producto;
};
