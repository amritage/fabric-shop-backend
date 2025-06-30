// controller/substructure.controller.js
const Substructure = require('../model/substructure');

// CREATE
exports.addSubstructure = async (req, res) => {
  try {
    const item = new Substructure({
      name: req.body.name,
      structureId: req.body.structureId,
    });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding substructure:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewSubstructures = async (req, res) => {
  try {
    const list = await Substructure.find().populate('structureId', 'name');
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching substructures:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateSubstructure = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updates = {
      name: req.body.name,
      structureId: req.body.structureId,
    };
    const updated = await Substructure.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating substructure:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteSubstructure = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await Substructure.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting substructure:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getSubstructureById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const item = await Substructure.findById(id).populate(
      'structureId',
      'name',
    );
    if (!item) {
      return res
        .status(404)
        .json({ status: 0, error: 'Substructure not found' });
    }
    res.json({ status: 1, data: item });
  } catch (err) {
    console.error('Error fetching substructure by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
