const { sequelize } = require("../db");

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // Usar { alter: true } en producción
    console.log("✅ Base de datos sincronizada");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
    process.exit(1);
  }
}

syncDatabase();
