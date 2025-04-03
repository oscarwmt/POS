/**
 * SECCIÓN 1: IMPORTS Y CONFIGURACIÓN INICIAL
 */
const express = require("express");
const router = express.Router();

/**
 * SECCIÓN 2: FUNCIONES DEL CONTROLADOR
 */

/**
 * Crear un nuevo pedido
 * @async
 * @function createOrder
 */
const createOrder = async (pool, orderData) => {
  const { cliente_id, mesa_id, productos, total, estado } = orderData;

  try {
    await pool.query("BEGIN");

    // 1. Insertar el pedido principal
    const orderResult = await pool.query(
      `INSERT INTO pedidos (cliente_id, mesa_id, total, estado)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [cliente_id, mesa_id, total, estado || "pendiente"]
    );
    const order = orderResult.rows[0];

    // 2. Insertar los productos del pedido
    for (const producto of productos) {
      await pool.query(
        `INSERT INTO pedido_productos (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [order.id, producto.id, producto.quantity, producto.precio]
      );
    }

    await pool.query("COMMIT");
    return order;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al crear pedido:", error);
    throw error;
  }
};

/**
 * Obtener pedidos por estado
 * @async
 * @function getOrdersByStatus
 */
const getOrdersByStatus = async (pool, status) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.nombre as cliente_nombre, m.numero as mesa_numero
       FROM pedidos p
       LEFT JOIN clientes c ON p.cliente_id = c.id
       LEFT JOIN mesas m ON p.mesa_id = m.id
       WHERE p.estado = $1
       ORDER BY p.fecha_creacion DESC`,
      [status]
    );
    return result.rows;
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    throw error;
  }
};

/**
 * SECCIÓN 3: DEFINICIÓN DE RUTAS
 */
module.exports = (pool) => {
  /**
   * POST /api/orders - Crear nuevo pedido
   */
  router.post("/", async (req, res) => {
    try {
      const newOrder = await createOrder(pool, req.body);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: "Error al crear pedido" });
    }
  });

  /**
   * GET /api/orders/pending - Obtener pedidos pendientes
   */
  router.get("/pending", async (req, res) => {
    try {
      const orders = await getOrdersByStatus(pool, "pendiente");
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener pedidos pendientes" });
    }
  });

  /**
   * PATCH /api/orders/:id/complete - Marcar pedido como completado
   */
  router.patch("/:id/complete", async (req, res) => {
    try {
      const result = await pool.query(
        "UPDATE pedidos SET estado = 'completado' WHERE id = $1 RETURNING *",
        [req.params.id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar pedido" });
    }
  });

  // TODO: Implementar otras rutas necesarias

  return router;
};
