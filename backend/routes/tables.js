/**
 * SECCIÓN 1: IMPORTS Y CONFIGURACIÓN INICIAL
 * - Dependencias y configuración básica
 */
const express = require("express");
const router = express.Router();
const db = require("../db");
const Sector = require("../models/Sector");

/**
 * SECCIÓN 2: FUNCIONES DEL CONTROLADOR
 * - Lógica para manejar las operaciones CRUD de mesas y sectores
 */

/**
 * Obtener todas las mesas con información de sector
 * @async
 * @function getAllTables
 */
const getAllTables = async (pool) => {
  try {
    const result = await pool.query(`
      SELECT m.*, s.nombre as sector_nombre 
      FROM mesas m
      LEFT JOIN sectores s ON m.sector_id = s.id
      ORDER BY m.numero ASC
    `);
    return result.rows;
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    throw error;
  }
};

/**
 * Crear una nueva mesa
 * @async
 * @function createTable
 */
const createTable = async (pool, tableData) => {
  const { numero, capacidad, sector_id, estado } = tableData;
  try {
    const result = await pool.query(
      `INSERT INTO mesas (numero, capacidad, sector_id, estado) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [numero, capacidad, sector_id, estado || "disponible"]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear mesa:", error);
    throw error;
  }
};

/**
 * Actualizar una mesa existente
 * @async
 * @function updateTable
 */
const updateTable = async (pool, id, tableData) => {
  const { numero, capacidad, sector_id, estado } = tableData;
  try {
    const result = await pool.query(
      `UPDATE mesas 
       SET numero = $1, capacidad = $2, sector_id = $3, estado = $4 
       WHERE id = $5 
       RETURNING *`,
      [numero, capacidad, sector_id, estado, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar mesa:", error);
    throw error;
  }
};

/**
 * Eliminar una mesa
 * @async
 * @function deleteTable
 */
const deleteTable = async (pool, id) => {
  try {
    const result = await pool.query(
      "DELETE FROM mesas WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar mesa:", error);
    throw error;
  }
};

/**
 * Obtener todos los sectores
 * @async
 * @function getAllSectors
 */
const getAllSectors = async () => {
  try {
    const sectors = await Sector.findAll();
    return sectors;
  } catch (error) {
    console.error("Error al obtener sectores:", error);
    throw error;
  }
};

/**
 * SECCIÓN 3: DEFINICIÓN DE RUTAS
 * - Todas las rutas relacionadas con mesas y sectores
 */
module.exports = (pool) => {
  /**
   * GET /api/tables - Obtener todas las mesas
   */
  router.get("/", async (req, res) => {
    try {
      const tables = await getAllTables(pool);
      res.status(200).json(tables);
    } catch (error) {
      console.error("Error al obtener mesas:", error);
      res.status(500).json({ error: "Error al obtener mesas" });
    }
  });

  /**
   * POST /api/tables - Crear una nueva mesa
   */
  router.post("/", async (req, res) => {
    try {
      const newTable = await createTable(pool, req.body);
      res.status(201).json(newTable);
    } catch (error) {
      res.status(500).json({ error: "Error al crear mesa" });
    }
  });

  /**
   * PUT /api/tables/:id - Actualizar una mesa existente
   */
  router.put("/:id", async (req, res) => {
    try {
      const updatedTable = await updateTable(pool, req.params.id, req.body);
      if (!updatedTable) {
        return res.status(404).json({ error: "Mesa no encontrada" });
      }
      res.status(200).json(updatedTable);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar mesa" });
    }
  });

  /**
   * DELETE /api/tables/:id - Eliminar una mesa
   */
  router.delete("/:id", async (req, res) => {
    try {
      const deletedTable = await deleteTable(pool, req.params.id);
      if (!deletedTable) {
        return res.status(404).json({ error: "Mesa no encontrada" });
      }
      res.status(200).json({ message: "Mesa eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar mesa" });
    }
  });

  /**
   * GET /api/tables/sectors - Obtener todos los sectores
   */
  router.get("/sectors", async (req, res) => {
    try {
      const sectors = await getAllSectors();
      res.status(200).json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener sectores" });
    }
  });

  return router;
};
