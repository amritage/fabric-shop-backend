// controllers/structureController.js
const Structure = require('../model/structure');

// Create
exports.addStructure = async (req, res) => {
  try {
    const struct = new Structure({ name: req.body.name });
    const saved = await struct.save();
    res.json(saved);
  } catch (err) {
    next(err);
  }
};

// Read all
exports.viewStructures = async (req, res) => {
  try {
    const list = await Structure.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    next(err);
  }
};

// UPDATE /api/structure/update/:id
exports.updateStructure = async (req, res) => {
  const id = req.params.id.trim();

  try {
    const updated = await Structure.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: 'Structure not found' });
    }

    res.status(200).json({ status: 1, data: updated });
  } catch (err) {
    next(err);
  }
};

// Delete by id
exports.deleteStructure = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await Structure.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    next(err);
  }
};

// GET ONE by ID
exports.getStructureById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const structure = await Structure.findById(id);
    if (!structure) {
      return res.status(404).json({ status: 0, error: 'Structure not found' });
    }
    res.json({ status: 1, data: structure });
  } catch (err) {
    next(err);
  }
};
