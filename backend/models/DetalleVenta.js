module.exports = (sequelize, DataTypes) => {
  const DetalleVenta = sequelize.define(
    "DetalleVenta",
    {
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "detalle_venta",
      timestamps: false,
    }
  );

  DetalleVenta.associate = (models) => {
    DetalleVenta.belongsTo(models.Venta, {
      foreignKey: "venta_id",
      as: "venta",
    });
    DetalleVenta.belongsTo(models.Producto, {
      foreignKey: "producto_id",
      as: "producto",
    });
  };

  return DetalleVenta;
};
