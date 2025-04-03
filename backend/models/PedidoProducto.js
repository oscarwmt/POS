module.exports = (sequelize, DataTypes) => {
  const PedidoProducto = sequelize.define(
    "PedidoProducto",
    {
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      observaciones: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "pedido_productos",
      timestamps: false,
    }
  );

  PedidoProducto.associate = (models) => {
    PedidoProducto.belongsTo(models.Pedido, {
      foreignKey: "pedido_id",
      as: "pedido",
    });
    PedidoProducto.belongsTo(models.Producto, {
      foreignKey: "producto_id",
      as: "producto",
    });
  };

  return PedidoProducto;
};
