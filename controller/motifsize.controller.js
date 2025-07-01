// controller/motifsize.controller.js
const Motifsize = require('../model/motifsize');

// CREATE
exports.addMotifsize = async (req, res) => {
  try {
    const m = new Motifsize({ name: req.body.name });
    const saved = await m.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding motifsize:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewMotifsizes = async (req, res) => {
  try {
    const list = await Motifsize.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching motifsizes:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateMotifsize = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const updated = await Motifsize.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating motifsize:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteMotifsize = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const deleted = await Motifsize.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting motifsize:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getMotifsizeById = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const motifsize = await Motifsize.findById(id);
    if (!motifsize) {
      return res.status(404).json({ status: 0, error: 'Motif size not found' });
    }
    res.json({ status: 1, data: motifsize });
  } catch (err) {
    console.error('Error fetching motif size by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
