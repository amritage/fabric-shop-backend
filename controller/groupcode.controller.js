const GroupCode = require('../model/groupcode');

// CREATE
exports.addGroupCode = async (req, res) => {
  try {
    const group = new GroupCode({ name: req.body.name });
    const saved = await group.save();
    res.status(201).json({ status: 1, message: 'Created', data: saved });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

// READ ALL
exports.viewGroupCodes = async (req, res) => {
  try {
    const list = await GroupCode.find();
    res.status(200).json({ status: 1, data: list });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

// READ ONE
exports.getGroupCodeById = async (req, res) => {
  try {
    const item = await GroupCode.findById(req.params.id.trim());
    if (!item) return res.status(404).json({ status: 0, message: 'Not found' });
    res.status(200).json({ status: 1, data: item });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

// UPDATE
exports.updateGroupCode = async (req, res) => {
  try {
    const updated = await GroupCode.findByIdAndUpdate(
      req.params.id.trim(),
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated)
      return res.status(404).json({ status: 0, message: 'Not found' });
    res.status(200).json({ status: 1, message: 'Updated', data: updated });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

// DELETE
exports.deleteGroupCode = async (req, res) => {
  try {
    const deleted = await GroupCode.findByIdAndDelete(req.params.id.trim());
    if (!deleted)
      return res.status(404).json({ status: 0, message: 'Not found' });
    res.status(200).json({ status: 1, message: 'Deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};
