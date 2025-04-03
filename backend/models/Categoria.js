module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define(
    "Categoria",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "categorias",
      timestamps: true,
    }
  );

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Producto, {
      foreignKey: "categoria_id",
      as: "productos",
    });
  };

  return Categoria;
};
