const NewCategoryModel = require('../model/newcategorydata');
const { cloudinaryServices } = require('../services/cloudinary.service');
const { deleteImagesFromCloudinary } = require('../utils/cloudinary');

function stripCloudinaryVersion(url) {
  return url ? url.replace(/\/v\d+\//, '/') : url;
}

async function uploadToCloudinary(file) {
  if (!file) return null;
  // Use only the base filename to avoid double folder nesting
  const baseFilename = file.originalname.split('/').pop();
  const result = await cloudinaryServices.cloudinaryImageUpload(
    file.buffer,
    baseFilename,
    'category', // Always use 'category' folder
    true, // forceFolder
  );
  return stripCloudinaryVersion(result.secure_url);
}

// POST /api/newcategory/addcategory
exports.addCategory = async (req, res) => {
  let imageUrl = null;
  if (req.files && req.files.image) {
    imageUrl = await uploadToCloudinary(req.files.image[0]);
  } else if (req.body.image) {
    imageUrl = stripCloudinaryVersion(req.body.image);
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

  try {
    // Get the current category to check if we need to delete old image
    const currentCategory = await NewCategoryModel.findById(id);
    if (!currentCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let oldImageUrl = null;
    if (req.files && req.files.image) {
      // New image uploaded, store old image URL for deletion
      oldImageUrl = currentCategory.image;
      updateData.image = await uploadToCloudinary(req.files.image[0]);
    } else if (req.body.image) {
      updateData.image = stripCloudinaryVersion(req.body.image);
    }

    const updated = await NewCategoryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    // Delete old image from Cloudinary if it exists and is different from new image
    if (oldImageUrl && oldImageUrl !== updateData.image) {
      try {
        await deleteImagesFromCloudinary(oldImageUrl);
        console.log(`Successfully deleted old category image: ${oldImageUrl}`);
      } catch (cloudinaryError) {
        console.error(
          'Error deleting old image from Cloudinary:',
          cloudinaryError,
        );
        // Don't fail the request if Cloudinary deletion fails
      }
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
    // First, get the category to access its image
    const category = await NewCategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get all products associated with this category
    const NewProductModel = require('../model/newproductdata');
    const associatedProducts = await NewProductModel.find({
      newCategoryId: id,
    });

    // Delete the category from database
    await NewCategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      msg: 'deleted successfully',
      status: 1,
      deletedCategory: true,
      deletedProductImages: associatedProducts.length,
    });
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
