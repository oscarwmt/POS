module.exports = (sequelize, DataTypes) => {
  const Compra = sequelize.define(
    "Compra",
    {
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      numero_factura: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "compras",
      timestamps: true,
    }
  );

  Compra.associate = (models) => {
    Compra.belongsTo(models.Proveedor, {
      foreignKey: "proveedor_id",
      as: "proveedor",
    });
    Compra.hasMany(models.MovimientoInventario, {
      foreignKey: "compra_id",
      as: "movimientos",
    });
  };

  return Compra;
};
