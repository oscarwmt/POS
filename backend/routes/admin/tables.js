const express = require("express");
const router = express.Router();
const tablesController = require("../../controllers/admin/tablesController");
const { validateAdmin } = require("../../middleware/auth");

router.use(validateAdmin);

// Búsqueda de sectores con creación en tiempo real
router.get("/sectors/search", async (req, res) => {
  try {
    const { query } = req.query;
    const sectors = await Sector.findAll({
      where: {
        nombre: { [Op.iLike]: `%${query}%` },
      },
      limit: 5,
    });
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Creación de mesa con selector de sector
router.post("/", tablesController.createTable);

module.exports = router;
