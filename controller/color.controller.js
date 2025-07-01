// controller/color.controller.js
const Color = require('../model/color');

// CREATE
exports.addColor = async (req, res) => {
  try {
    const c = new Color({
      name: req.body.name,
      css: req.body.css,
    });
    const saved = await c.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding color:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewColors = async (req, res) => {
  try {
    const list = await Color.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching colors:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ONE by ID
exports.viewColorById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const color = await Color.findById(id);
    if (!color) {
      return res.status(404).json({ status: 0, error: 'Color not found' });
    }
    res.json({ status: 1, data: color });
  } catch (err) {
    console.error('Error fetching color by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateColor = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updated = await Color.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        css: req.body.css,
      },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating color:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteColor = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const deleted = await Color.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting color:', err);
    res.status(500).json({ error: err.message });
  }
};
