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
    next(err);
  }
};

// READ ALL
exports.viewSuitablefors = async (req, res) => {
  try {
    const list = await Suitablefor.find();
    res.json({ status: 1, data: list });
  } catch (err) {
    console.error('Error fetching suitablefors:', err);
    next(err);
  }
};

// UPDATE by ID
exports.updateSuitablefor = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
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
    next(err);
  }
};

// DELETE by ID
exports.deleteSuitablefor = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
  try {
    const NewProductModel = require('../model/newproductdata');
    const Subsuitable = require('../model/subsuitable');
    const associatedProducts = await NewProductModel.find({
      suitableforId: id,
    });
    if (associatedProducts.length > 0) {
      return res.status(400).json({
        error: 'This suitablefor is already in use and cannot be deleted',
        inUse: true,
        productCount: associatedProducts.length,
      });
    }
    // Check for references in subsuitable
    const associatedSubsuitables = await Subsuitable.find({
      suitableforId: id,
    });
    if (associatedSubsuitables.length > 0) {
      return res.status(400).json({
        error:
          'This suitablefor is already in use in subsuitable and cannot be deleted',
        inUse: true,
        subsuitableCount: associatedSubsuitables.length,
      });
    }
    const deleted = await Suitablefor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ status: 1, data: deleted });
  } catch (err) {
    console.error('Error deleting suitablefor:', err);
    next(err);
  }
};

// GET ONE by ID
exports.getSuitableforById = async (req, res) => {
  const id =
    typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
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
    next(err);
  }
};
