/**
 * SECCIÓN 1: IMPORTS Y CONFIGURACIÓN
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * SECCIÓN 2: DEFINICIÓN DEL MODELO
   */
  const Sector = sequelize.define(
    "Sector",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El nombre del sector es requerido",
          },
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "#6c757d",
      },
    },
    {
      tableName: "sectores",
      timestamps: true, // Usa los nombres predeterminados: createdAt y updatedAt
    }
  );

  /**
   * SECCIÓN 3: MÉTODOS DEL MODELO
   */

  Sector.associate = (models) => {
    Sector.hasMany(models.Mesa, {
      foreignKey: "sector_id",
      as: "mesas",
    });
  };

  return Sector;
};
