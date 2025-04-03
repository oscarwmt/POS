module.exports = (pool) => {
  const express = require("express");
  const router = express.Router();

  // Validación de datos de categoría
  const validateCategory = (req, res, next) => {
    const { nombre } = req.body;
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return res
        .status(400)
        .json({ error: "El nombre de la categoría es requerido" });
    }
    next();
  };

  // Obtener todas las categorías activas
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM categorias");
      res.json(result.rows);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Crear nueva categoría
  router.post("/", validateCategory, async (req, res) => {
    const { nombre, color, descripcion } = req.body;

    try {
      const { rows } = await pool.query(
        `INSERT INTO categorias (nombre, color, descripcion) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
        [nombre, color || "#6c757d", descripcion]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("Error al crear categoría:", err);
      res.status(500).json({ error: "Error al crear categoría" });
    }
  });

  // Actualizar categoría
  router.put("/:id", validateCategory, async (req, res) => {
    const { id } = req.params;
    const { nombre, color, descripcion } = req.body;

    try {
      const { rows } = await pool.query(
        `UPDATE categorias 
           SET nombre = $1, color = $2, descripcion = $3, actualizado_en = NOW() 
           WHERE id = $4 AND activo = true 
           RETURNING *`,
        [nombre, color, descripcion, id]
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Categoría no encontrada o inactiva" });
      }

      res.json(rows[0]);
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      res.status(500).json({ error: "Error al actualizar categoría" });
    }
  });

  // Desactivar categoría (eliminación lógica)
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      // Verificar si la categoría tiene productos asociados
      const productosRes = await pool.query(
        "SELECT id FROM productos WHERE categoria_id = $1 AND activo = true LIMIT 1",
        [id]
      );

      if (productosRes.rows.length > 0) {
        return res.status(400).json({
          error:
            "No se puede eliminar la categoría porque tiene productos asociados",
        });
      }

      const { rowCount } = await pool.query(
        "UPDATE categorias SET activo = false WHERE id = $1",
        [id]
      );

      if (rowCount === 0) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }

      res.status(204).end();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      res.status(500).json({ error: "Error al eliminar categoría" });
    }
  });

  return router;
};
