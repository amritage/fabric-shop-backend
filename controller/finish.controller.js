// controller/finish.controller.js
const Finish = require('../model/finish');

// CREATE
exports.addFinish = async (req, res) => {
  try {
    const f = new Finish({ name: req.body.name });
    const saved = await f.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding finish:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewFinishes = async (req, res) => {
  try {
    const all = await Finish.find();
    res.json({ status: 1, data: all });
  } catch (err) {
    console.error('Error fetching finishes:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateFinish = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const updated = await Finish.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating finish:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteFinish = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const deleted = await Finish.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting finish:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getFinishById = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const finish = await Finish.findById(id);
    if (!finish) {
      return res.status(404).json({ status: 0, error: 'Finish not found' });
    }
    res.json({ status: 1, data: finish });
  } catch (err) {
    console.error('Error fetching finish by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
