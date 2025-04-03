module.exports = (sequelize, DataTypes) => {
  const Venta = sequelize.define(
    "Venta",
    {
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: "pendiente",
      },
      mesa_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "ventas",
      timestamps: true,
    }
  );

  Venta.associate = (models) => {
    Venta.belongsTo(models.Cliente, {
      foreignKey: "cliente_id",
      as: "cliente",
    });
    Venta.hasMany(models.DetalleVenta, {
      foreignKey: "venta_id",
      as: "detalles",
    });
    Venta.belongsTo(models.Mesa, {
      foreignKey: "mesa_id",
      as: "mesa",
    });
  };

  return Venta;
};
