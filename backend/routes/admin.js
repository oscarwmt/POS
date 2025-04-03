const express = require("express");
const router = express.Router();
const { checkAdmin } = require("../middleware/auth");

// Middleware para verificar permisos de administrador
router.use(checkAdmin);

// Importar submódulos
router.use("/sectors", require("./admin/sectors"));
router.use("/tables", require("./admin/tables"));
router.use("/products", require("./admin/products"));
router.use("/categories", require("./admin/categories"));
router.use("/users", require("./admin/users"));
router.use("/clients", require("./admin/clients"));

module.exports = router;
