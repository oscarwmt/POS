module.exports = (pool) => {
  const express = require("express");
  const router = express.Router();

  // Obtener todos los sectores
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM sectores ORDER BY nombre ASC"
      );
      res.status(200).json(result.rows); // Devuelve los datos al cliente
    } catch (err) {
      console.error("Error al obtener sectores:", err);
      res.status(500).json({ error: "Error al obtener sectores" });
    }
  });

  // Eliminar un sector por ID
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un número válido
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      const result = await pool.query("DELETE FROM sectores WHERE id = $1", [
        id,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Sector no encontrado" });
      }
      res.status(200).json({ message: "Sector eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar sector:", err);
      res.status(500).json({ error: "Error al eliminar sector" });
    }
  });

  return router;
};
