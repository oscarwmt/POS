const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  /**
   * GET /api/customers - Obtener todos los clientes
   */
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM clientes ORDER BY nombre ASC"
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      res.status(500).json({ error: "Error al obtener clientes" });
    }
  });

  /**
   * POST /api/customers - Crear nuevo cliente
   */
  router.post("/", async (req, res) => {
    const { nombre, identificacion, telefono, email } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO clientes (nombre, identificacion, telefono, email)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nombre, identificacion || null, telefono || null, email || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      res.status(500).json({ error: "Error al crear cliente" });
    }
  });

  return router;
};
