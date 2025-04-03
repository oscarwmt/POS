module.exports = (sequelize, DataTypes) => {
  const MovimientoInventario = sequelize.define(
    "MovimientoInventario",
    {
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM("entrada", "salida"),
        allowNull: false,
      },
      motivo: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "movimientos_inventario",
      timestamps: true,
    }
  );

  MovimientoInventario.associate = (models) => {
    MovimientoInventario.belongsTo(models.Producto, {
      foreignKey: "producto_id",
      as: "producto",
    });
    MovimientoInventario.belongsTo(models.Compra, {
      foreignKey: "compra_id",
      as: "compra",
    });
  };

  return MovimientoInventario;
};
