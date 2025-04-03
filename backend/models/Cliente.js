module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      identificacion: {
        type: DataTypes.STRING,
      },
      telefono: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      direccion: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "clientes",
      timestamps: true,
    }
  );

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Venta, {
      foreignKey: "cliente_id",
      as: "ventas",
    });
    Cliente.hasMany(models.Pedido, {
      foreignKey: "cliente_id",
      as: "pedidos",
    });
  };

  return Cliente;
};
