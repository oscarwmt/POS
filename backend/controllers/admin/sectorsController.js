// backend/controllers/sectorsController.js
const Sector = require("../../models/Sector");

exports.getAll = async (req, res) => {
  try {
    const sectors = await Sector.findAll();
    res.json(sectors);
  } catch (error) {
    console.error("Error al obtener sectores:", error);
    res.status(500).json({ error: "Error al obtener sectores" });
  }
};

exports.create = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }
  try {
    const newSector = await Sector.create({ nombre, descripcion });
    res.status(201).json(newSector);
  } catch (error) {
    console.error("Error al crear sector:", error);
    res.status(500).json({ error: "Error al crear sector" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }
  try {
    const sector = await Sector.findByPk(id);
    if (!sector) {
      return res.status(404).json({ error: "Sector no encontrado" });
    }
    sector.nombre = nombre;
    sector.descripcion = descripcion;
    await sector.save();
    res.json(sector);
  } catch (error) {
    console.error("Error al actualizar sector:", error);
    res.status(500).json({ error: "Error al actualizar sector" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const sector = await Sector.findByPk(id);
    if (!sector) {
      return res.status(404).json({ error: "Sector no encontrado" });
    }
    await sector.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar sector:", error);
    res.status(500).json({ error: "Error al eliminar sector" });
  }
};
