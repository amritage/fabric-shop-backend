const NewCategoryModel = require('../model/newcategorydata');

// Utility to generate full image URL
const getImageUrl = (filename) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:7000';
 
  return `${BASE_URL}/uploadimage/${filename}`;
};

// POST /api/newcategory/addcategory
exports.addCategory = async (req, res) => {
  console.log('>>> req.body:', req.body);
  console.log('>>> req.files:', req.files);

  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'No file received' });
  }

  try {
    const imageUrl = getImageUrl(req.files.image[0].filename);

    const newCat = new NewCategoryModel({
      name: req.body.name,
      image: imageUrl,
    });

    const saved = await newCat.save();
    console.log('Category Data is Stored Successfully');
    res.json(saved);
  } catch (error) {
    console.error('Data is not Stored', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/newcategory/viewcategory
exports.viewCategories = async (req, res) => {
  try {
    const list = await NewCategoryModel.find();
    res.status(200).json({ status: 1, message: 'success', data: list });
  } catch (error) {
    console.error('Error fetching categories', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/newcategory/update/:categoryid
exports.updateCategory = async (req, res) => {
  console.log('>>> req.body:', req.body);
  console.log('>>> req.files:', req.files);

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

    console.log('Category Data is Updated Successfully');
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating category', error);
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
    console.error('Error deleting category', error);
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
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ status: 0, error: error.message });
  }
};
