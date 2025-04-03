module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define(
    "Pedido",
    {
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: "pendiente",
      },
      observaciones: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "pedidos",
      timestamps: true,
    }
  );

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Cliente, {
      foreignKey: "cliente_id",
      as: "cliente",
    });
    Pedido.belongsTo(models.Mesa, {
      foreignKey: "mesa_id",
      as: "mesa",
    });
    Pedido.hasMany(models.PedidoProducto, {
      foreignKey: "pedido_id",
      as: "productos",
    });
  };

  return Pedido;
};
