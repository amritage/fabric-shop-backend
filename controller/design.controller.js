// controller/design.controller.js
const Design = require('../model/design');

// CREATE
exports.addDesign = async (req, res) => {
  try {
    const d = new Design({ name: req.body.name });
    const saved = await d.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding design:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewDesigns = async (req, res) => {
  try {
    const all = await Design.find();
    res.json({ status: 1, data: all });
  } catch (err) {
    console.error('Error fetching designs:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getDesignById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ status: 0, error: 'Design not found' });
    }
    res.json({ status: 1, data: design });
  } catch (err) {
    console.error('Error fetching design by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};

// UPDATE by ID
exports.updateDesign = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updated = await Design.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating design:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteDesign = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await Design.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting design:', err);
    res.status(500).json({ error: err.message });
  }
};
