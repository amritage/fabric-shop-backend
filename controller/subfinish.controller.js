// controller/subfinish.controller.js
const Subfinish = require('../model/subfinish');

// CREATE
exports.addSubfinish = async (req, res) => {
  try {
    const item = new Subfinish({
      name: req.body.name,
      finishId: req.body.finishId,
    });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding subfinish:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewSubfinishes = async (req, res) => {
  try {
    const list = await Subfinish.find().populate('finishId', 'name');
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching subfinishes:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateSubfinish = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updates = {
      name: req.body.name,
      finishId: req.body.finishId,
    };
    const updated = await Subfinish.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating subfinish:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteSubfinish = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await Subfinish.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting subfinish:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getSubfinishById = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const item = await Subfinish.findById(id).populate('finishId', 'name');
    if (!item) {
      return res.status(404).json({ status: 0, error: 'Subfinish not found' });
    }
    res.json({ status: 1, data: item });
  } catch (err) {
    console.error('Error fetching subfinish by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
