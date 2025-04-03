module.exports = (sequelize, DataTypes) => {
  const Mesa = sequelize.define(
    "Mesa",
    {
      numero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacidad: {
        type: DataTypes.INTEGER,
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: "disponible",
      },
    },
    {
      tableName: "mesas",
      timestamps: true,
    }
  );

  Mesa.associate = (models) => {
    Mesa.belongsTo(models.Sector, {
      foreignKey: "sector_id",
      as: "sector",
    });
    Mesa.hasMany(models.Venta, {
      foreignKey: "mesa_id",
      as: "ventas",
    });
    Mesa.hasMany(models.Pedido, {
      foreignKey: "mesa_id",
      as: "pedidos",
    });
  };

  return Mesa;
};
