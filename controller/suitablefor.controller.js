// controller/suitablefor.controller.js
const Suitablefor = require('../model/suitablefor');

// CREATE
exports.addSuitablefor = async (req, res) => {
  try {
    const item = new Suitablefor({ name: req.body.name });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding suitablefor:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewSuitablefors = async (req, res) => {
  try {
    const list = await Suitablefor.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching suitablefors:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateSuitablefor = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updated = await Suitablefor.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating suitablefor:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteSuitablefor = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await Suitablefor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting suitablefor:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getSuitableforById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const item = await Suitablefor.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ status: 0, error: 'Suitablefor not found' });
    }
    res.json({ status: 1, data: item });
  } catch (err) {
    console.error('Error fetching suitablefor by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
