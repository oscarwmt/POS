const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

module.exports = (pool, upload) => {
  // Helper para eliminar imágenes de forma segura
  const safeDeleteImage = (imagePath) => {
    if (!imagePath) return;
    const fullPath = path.join(
      __dirname,
      "../../public/uploads/products",
      imagePath
    );
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error("Error al eliminar imagen:", err);
      }
    }
  };

  // Obtener todos los productos
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria = c.id
        ORDER BY p.id
      `);

      const products = result.rows.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        categoria: product.categoria
          ? {
              id: product.categoria,
              nombre: product.categoria_nombre,
            }
          : null,
        codigo_barras: product.codigo_barras,
        descripcion: product.descripcion,
        stock: product.stock,
        activo: product.activo,
        imagen: product.imagen
          ? `/public/uploads/products/${product.imagen}`
          : null,
      }));

      res.json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  });

  // Crear nuevo producto
  router.post("/", upload.single("imagen"), async (req, res) => {
    try {
      const {
        nombre,
        precio,
        categoria,
        codigo_barras,
        descripcion,
        stock,
        activo,
      } = req.body;

      // Validación de campos requeridos
      if (!nombre || !precio || !categoria) {
        if (req.file) safeDeleteImage(req.file.filename);
        return res.status(400).json({
          error: "Campos requeridos faltantes",
          details: {
            nombre: !nombre ? "El nombre es requerido" : undefined,
            precio: !precio ? "El precio es requerido" : undefined,
            categoria: !categoria ? "La categoría es requerida" : undefined,
          },
        });
      }

      // Validación de tipos de datos
      if (isNaN(parseFloat(precio))) {
        if (req.file) safeDeleteImage(req.file.filename);
        return res
          .status(400)
          .json({ error: "El precio debe ser un número válido" });
      }

      if (categoria && isNaN(parseInt(categoria))) {
        if (req.file) safeDeleteImage(req.file.filename);
        return res
          .status(400)
          .json({ error: "La categoría debe ser un ID válido" });
      }

      const { rows } = await pool.query(
        `INSERT INTO productos (
          nombre, precio, categoria, codigo_barras, 
          descripcion, stock, activo, imagen
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [
          nombre,
          parseFloat(precio),
          parseInt(categoria),
          codigo_barras || null,
          descripcion || null,
          parseInt(stock || 0),
          activo !== "false",
          req.file ? req.file.filename : null,
        ]
      );

      res.status(201).json({
        ...rows[0],
        imagen: rows[0].imagen ? rows[0].imagen : null,
      });
    } catch (error) {
      if (req.file) safeDeleteImage(req.file.filename);
      console.error("Error al crear producto:", error);
      res.status(500).json({
        error: "Error al crear producto",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  // Actualizar producto existente
  router.put("/:id", upload.single("imagen"), async (req, res) => {
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);
    console.log("ID del producto:", req.params.id);

    try {
      const { id } = req.params;
      const {
        nombre,
        precio,
        categoria,
        codigo_barras,
        descripcion,
        stock,
        activo,
      } = req.body;

      // Validación mejorada de ID
      if (!id || isNaN(parseInt(id))) {
        if (req.file) safeDeleteImage(req.file.filename);
        return res.status(400).json({ error: "ID de producto inválido" });
      }

      // Obtener producto actual
      const currentProduct = await pool.query(
        "SELECT * FROM productos WHERE id = $1",
        [id]
      );
      if (currentProduct.rows.length === 0) {
        if (req.file) safeDeleteImage(req.file.filename);
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Manejo de imagen
      let imagenNombre = currentProduct.rows[0].imagen;
      if (req.file) {
        // Eliminar imagen anterior si existe
        if (currentProduct.rows[0].imagen) {
          safeDeleteImage(currentProduct.rows[0].imagen);
        }
        imagenNombre = req.file.filename;
      }

      // Construir objeto de actualización
      const updateData = {
        nombre: nombre || currentProduct.rows[0].nombre,
        precio: precio ? parseFloat(precio) : currentProduct.rows[0].precio,
        categoria: categoria
          ? parseInt(categoria)
          : currentProduct.rows[0].categoria,
        codigo_barras: codigo_barras || currentProduct.rows[0].codigo_barras,
        descripcion: descripcion || currentProduct.rows[0].descripcion,
        stock: stock ? parseInt(stock) : currentProduct.rows[0].stock,
        activo:
          activo !== undefined
            ? activo !== "false"
            : currentProduct.rows[0].activo,
        imagen: imagenNombre,
      };

      // Actualizar en la base de datos
      const { rows } = await pool.query(
        `UPDATE productos SET
          nombre = $1,
          precio = $2,
          categoria = $3,
          codigo_barras = $4,
          descripcion = $5,
          stock = $6,
          activo = $7,
          imagen = $8
        WHERE id = $9
        RETURNING *`,
        [
          updateData.nombre,
          updateData.precio,
          updateData.categoria,
          updateData.codigo_barras,
          updateData.descripcion,
          updateData.stock,
          updateData.activo,
          updateData.imagen,
          id,
        ]
      );

      res.json({
        ...rows[0],
        imagen: rows[0].imagen ? rows[0].imagen : null,
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      if (req.file) safeDeleteImage(req.file.filename);
      res.status(500).json({
        error: "Error al actualizar producto",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  // Eliminar producto
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Validación de ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "ID de producto inválido" });
      }

      // Obtener producto para eliminar su imagen
      const currentProduct = await pool.query(
        "SELECT imagen FROM productos WHERE id = $1",
        [id]
      );
      if (currentProduct.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Eliminar imagen asociada si existe
      if (currentProduct.rows[0].imagen) {
        safeDeleteImage(currentProduct.rows[0].imagen);
      }

      // Eliminar producto de la base de datos
      await pool.query("DELETE FROM productos WHERE id = $1", [id]);

      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({
        error: "Error al eliminar producto",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  return router;
};
