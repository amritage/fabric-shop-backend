const NewCategoryModel = require('../model/newcategorydata');

// Utility to generate full image URL
const getImageUrl = (filename) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:7000';

  return `${BASE_URL}/uploadimage/${filename}`;
};

// POST /api/newcategory/addcategory
exports.addCategory = async (req, res) => {
  let imageUrl = null;
  if (req.files && req.files.image) {
    imageUrl = getImageUrl(req.files.image[0].filename);
  }

  try {
    const newCat = new NewCategoryModel({
      name: req.body.name,
      image: imageUrl,
    });

    const saved = await newCat.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/newcategory/viewcategory
exports.viewCategories = async (req, res) => {
  try {
    const list = await NewCategoryModel.find();
    res.status(200).json({ status: 1, message: 'success', data: list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/newcategory/update/:categoryid
exports.updateCategory = async (req, res) => {
  const id = req.params.categoryid.trim();
  const updateData = { name: req.body.name };

  // If a new image was uploaded, include it with full URL
  if (req.files && req.files.image) {
    updateData.image = getImageUrl(req.files.image[0].filename);
  }

  try {
    const updated = await NewCategoryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/newcategory/deletecategory/:categoryid
exports.deleteCategory = async (req, res) => {
  const id = req.params.categoryid.trim();
  try {
    await NewCategoryModel.findByIdAndDelete(id);
    res.status(200).json({ msg: 'deleted successfully', status: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE by ID
exports.getCategoryById = async (req, res) => {
  const id = req.params.categoryid.trim();
  try {
    const category = await NewCategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ status: 0, error: 'Category not found' });
    }
    res.status(200).json({ status: 1, data: category });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};
