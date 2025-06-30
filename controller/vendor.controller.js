// controller/vendor.controller.js
const Vendor = require('../model/vendor');

// CREATE
exports.addVendor = async (req, res) => {
  try {
    const v = new Vendor({ name: req.body.name });
    const saved = await v.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding vendor:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.viewVendors = async (req, res) => {
  try {
    const list = await Vendor.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE by ID
exports.updateVendor = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updated = await Vendor.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: updated });
  } catch (err) {
    console.error('Error updating vendor:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteVendor = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await Vendor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting vendor:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE by ID
exports.getVendorById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ status: 0, error: 'Vendor not found' });
    }
    res.json({ status: 1, data: vendor });
  } catch (err) {
    console.error('Error fetching vendor by ID:', err);
    res.status(500).json({ status: 0, error: err.message });
  }
};
