module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define(
    "Proveedor",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ruc: {
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
      tableName: "proveedores",
      timestamps: true,
    }
  );

  Proveedor.associate = (models) => {
    Proveedor.hasMany(models.Compra, {
      foreignKey: "proveedor_id",
      as: "compras",
    });
    Proveedor.hasMany(models.Producto, {
      foreignKey: "proveedor_id",
      as: "productos",
    });
  };

  return Proveedor;
};
