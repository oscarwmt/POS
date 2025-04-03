const express = require("express");
const router = express.Router();
const sectorsController = require("../../controllers/admin/sectorsController");

// Obtener todos los sectores
router.get("/", sectorsController.getAll);

// Crear un nuevo sector
router.post("/", async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO sectores (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear sector:", error);
    res.status(500).json({ error: "Error al crear sector" });
  }
});

// Actualizar un sector existente
router.put("/:id", sectorsController.update);

// Eliminar un sector
router.delete("/:id", sectorsController.delete);

router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM sectores WHERE nombre ILIKE $1 ORDER BY nombre ASC",
      [`%${query}%`]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al buscar sectores:", error);
    res.status(500).json({ error: "Error al buscar sectores" });
  }
});

module.exports = router;
