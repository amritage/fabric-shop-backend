// controller/subsuitable.controller.js
const SubSuitable = require('../model/subsuitable');

// CREATE
exports.addSubSuitable = async (req, res) => {
  try {
    const item = new SubSuitable({
      name: req.body.name,
      suitableforId: req.body.suitableforId,
    });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding subsuitable:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewSubSuitables = async (req, res) => {
  try {
    const list = await SubSuitable.find().populate('suitableforId', 'name');
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching subsuitables:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateSubSuitable = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updates = {
      name: req.body.name,
      suitableforId: req.body.suitableforId,
    };
    const updated = await SubSuitable.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating subsuitable:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteSubSuitable = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await SubSuitable.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting subsuitable:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getSubSuitableById = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const item = await SubSuitable.findById(id).populate(
      'suitableforId',
      'name',
    );
    if (!item) {
      return res
        .status(404)
        .json({ status: 0, error: 'Sub-suitable not found' });
    }
    res.json({ status: 1, data: item });
  } catch (err) {
    console.error('Error fetching subsuitable by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
