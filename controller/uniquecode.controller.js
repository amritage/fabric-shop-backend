// controller/uniquecode.controller.js
const UniqueCode = require('../model/uniquecode');

// CREATE
exports.addUniqueCode = async (req, res) => {
  try {
    const item = new UniqueCode({ name: req.body.name });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding uniquecode:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewUniqueCodes = async (req, res) => {
  try {
    const list = await UniqueCode.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching uniquecodes:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateUniqueCode = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updated = await UniqueCode.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating uniquecode:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteUniqueCode = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await UniqueCode.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting uniquecode:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getUniqueCodeById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const item = await UniqueCode.findById(id);
    if (!item) {
      return res.status(404).json({ status: 0, error: 'UniqueCode not found' });
    }
    res.json({ status: 1, data: item });
  } catch (err) {
    console.error('Error fetching UniqueCode by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
