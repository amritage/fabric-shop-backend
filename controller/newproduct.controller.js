const NewProductModel = require('../model/newproductdata');
const { cloudinaryServices } = require('../services/cloudinary.service');
const NewCategoryModel = require('../model/newcategorydata');
const slugify = require('slugify');

function stripCloudinaryVersion(url) {
  return url ? url.replace(/\/v\d+\//, '/') : url;
}

// Helper to upload a file buffer to Cloudinary and return the URL
async function uploadToCloudinary(file, folder) {
  if (!file) return null;
  const result = await cloudinaryServices.cloudinaryImageUpload(
    file.buffer,
    file.originalname,
    folder,
  );
  return stripCloudinaryVersion(result.secure_url);
}

// CREATE
exports.addProduct = async (req, res, next) => {
  try {
    const files = req.files || {};

    // Determine folder name based on newCategoryId
    let folderName = 'product';
    console.log('newCategoryId:', req.body.newCategoryId);
    if (req.body.newCategoryId) {
      try {
        const category = await NewCategoryModel.findById(
          req.body.newCategoryId,
        );
        console.log('Fetched category:', category);
        if (category && category.name) {
          folderName = slugify(category.name, { lower: true, strict: true });
          console.log('Using folder:', folderName);
        }
      } catch (err) {
        console.log('Category fetch error:', err);
        // fallback to 'product'
      }
    }

    // Upload images/videos to Cloudinary
    const imageUrl = files.image
      ? await uploadToCloudinary(files.image[0], folderName)
      : stripCloudinaryVersion(req.body.image) || null;
    const image1Url = files.image1
      ? await uploadToCloudinary(files.image1[0], folderName)
      : stripCloudinaryVersion(req.body.image1) || null;
    const image2Url = files.image2
      ? await uploadToCloudinary(files.image2[0], folderName)
      : stripCloudinaryVersion(req.body.image2) || null;
    const videoUrl = files.video
      ? await uploadToCloudinary(files.video[0], folderName)
      : stripCloudinaryVersion(req.body.video) || null;

    const payload = {
      sku: req.body.sku,
      slug: req.body.slug,
      name: req.body.name,
      newCategoryId: req.body.newCategoryId,
      productdescription: req.body.productdescription,
      popularproduct: req.body.popularproduct,
      productoffer: req.body.productoffer,
      topratedproduct: req.body.topratedproduct,
      image: imageUrl,
      image1: image1Url,
      image2: image2Url,
      video: videoUrl,
      structureId: req.body.structureId,
      contentId: req.body.contentId,
      gsm: req.body.gsm,
      oz: req.body.oz,
      cm: req.body.cm,
      inch: req.body.inch,
      quantity: req.body.quantity,
      um: req.body.um,
      currency: req.body.currency,
      finishId: req.body.finishId,
      designId: req.body.designId,
      colorId: req.body.colorId,
      css: req.body.css,
      motifsizeId: req.body.motifsizeId,
      suitableforId: req.body.suitableforId,
      vendorId: req.body.vendorId,
      groupcodeId: req.body.groupcodeId,
      charset: req.body.charset,
      xUaCompatible: req.body.xUaCompatible,
      viewport: req.body.viewport,
      title: req.body.title,
      description: req.body.description,
      keywords: req.body.keywords,
      robots: req.body.robots,
      contentLanguage: req.body.contentLanguage,
      googleSiteVerification: req.body.googleSiteVerification,
      msValidate: req.body.msValidate,
      themeColor: req.body.themeColor,
      mobileWebAppCapable: req.body.mobileWebAppCapable === 'true',
      appleStatusBarStyle: req.body.appleStatusBarStyle,
      formatDetection: req.body.formatDetection,
      ogLocale: req.body.ogLocale,
      ogTitle: req.body.ogTitle,
      ogDescription: req.body.ogDescription,
      ogType: req.body.ogType,
      ogUrl: req.body.ogUrl,
      ogSiteName: req.body.ogSiteName,
      twitterCard: req.body.twitterCard,
      twitterSite: req.body.twitterSite,
      twitterTitle: req.body.twitterTitle,
      twitterDescription: req.body.twitterDescription,
      hreflang: req.body.hreflang,
      x_default: req.body.x_default,
      author_name: req.body.author_name,
      excerpt: req.body.excerpt,
      canonical_url: req.body.canonical_url,
      description_html: req.body.description_html,
      rating_value: req.body.rating_value,
      rating_count: req.body.rating_count,
      purchasePrice: req.body.purchasePrice,
      salesPrice: req.body.salesPrice,
      locationCode: req.body.locationCode,
      productIdentifier: req.body.productIdentifier,
      subsuitableId: req.body.subsuitableId,
      subfinishId: req.body.subfinishId,
      substructureId: req.body.substructureId,
    };

    const product = await NewProductModel.create(payload);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    next(error);
  }
};

// READ ALL
exports.viewProducts = async (req, res, next) => {
  try {
    const list = await NewProductModel.find();
    res.status(200).json({ status: 1, data: list });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
};

// GET ONE by ID
exports.getProductById = async (req, res, next) => {
  const id = req.params.id.trim();
  try {
    const product = await NewProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ status: 0, error: 'Product not found' });
    }
    res.status(200).json({ status: 1, data: product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    next(error);
  }
};

// UPDATE
exports.updateProduct = async (req, res, next) => {
  try {
    const id =
      typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
    const files = req.files || {};

    // Determine folder name based on newCategoryId
    let folderName = 'product';
    console.log('newCategoryId:', req.body.newCategoryId);
    if (req.body.newCategoryId) {
      try {
        const category = await NewCategoryModel.findById(
          req.body.newCategoryId,
        );
        console.log('Fetched category:', category);
        if (category && category.name) {
          folderName = slugify(category.name, { lower: true, strict: true });
          console.log('Using folder:', folderName);
        }
      } catch (err) {
        console.log('Category fetch error:', err);
        // fallback to 'product'
      }
    }

    // Upload images/videos to Cloudinary if present
    const updates = {
      sku: req.body.sku,
      slug: req.body.slug,
      name: req.body.name,
      newCategoryId: req.body.newCategoryId,
      productdescription: req.body.productdescription,
      popularproduct: req.body.popularproduct,
      productoffer: req.body.productoffer,
      topratedproduct: req.body.topratedproduct,
      structureId: req.body.structureId,
      contentId: req.body.contentId,
      gsm: req.body.gsm,
      oz: req.body.oz,
      cm: req.body.cm,
      inch: req.body.inch,
      quantity: req.body.quantity,
      um: req.body.um,
      currency: req.body.currency,
      finishId: req.body.finishId,
      designId: req.body.designId,
      colorId: req.body.colorId,
      css: req.body.css,
      motifsizeId: req.body.motifsizeId,
      suitableforId: req.body.suitableforId,
      vendorId: req.body.vendorId,
      groupcodeId: req.body.groupcodeId,
      charset: req.body.charset,
      xUaCompatible: req.body.xUaCompatible,
      viewport: req.body.viewport,
      title: req.body.title,
      description: req.body.description,
      keywords: req.body.keywords,
      robots: req.body.robots,
      contentLanguage: req.body.contentLanguage,
      googleSiteVerification: req.body.googleSiteVerification,
      msValidate: req.body.msValidate,
      themeColor: req.body.themeColor,
      mobileWebAppCapable: req.body.mobileWebAppCapable === 'true',
      appleStatusBarStyle: req.body.appleStatusBarStyle,
      formatDetection: req.body.formatDetection,
      ogLocale: req.body.ogLocale,
      ogTitle: req.body.ogTitle,
      ogDescription: req.body.ogDescription,
      ogType: req.body.ogType,
      ogUrl: req.body.ogUrl,
      ogSiteName: req.body.ogSiteName,
      twitterCard: req.body.twitterCard,
      twitterSite: req.body.twitterSite,
      twitterTitle: req.body.twitterTitle,
      twitterDescription: req.body.twitterDescription,
      hreflang: req.body.hreflang,
      x_default: req.body.x_default,
      author_name: req.body.author_name,
      excerpt: req.body.excerpt,
      canonical_url: req.body.canonical_url,
      description_html: req.body.description_html,
      rating_value: req.body.rating_value,
      rating_count: req.body.rating_count,
      purchasePrice: req.body.purchasePrice,
      salesPrice: req.body.salesPrice,
      locationCode: req.body.locationCode,
      productIdentifier: req.body.productIdentifier,
      subsuitableId: req.body.subsuitableId,
      subfinishId: req.body.subfinishId,
      substructureId: req.body.substructureId,
      ...(files.image && {
        image: await uploadToCloudinary(files.image[0], folderName),
      }),
      ...(files.image1 && {
        image1: await uploadToCloudinary(files.image1[0], folderName),
      }),
      ...(files.image2 && {
        image2: await uploadToCloudinary(files.image2[0], folderName),
      }),
      ...(files.video && {
        video: await uploadToCloudinary(files.video[0], folderName),
      }),
    };

    const updated = await NewProductModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
};

// DELETE
exports.deleteProduct = async (req, res, next) => {
  try {
    const id =
      typeof req.params.id === 'string' ? req.params.id.trim() : req.params.id;
    const deleted = await NewProductModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ status: 1, data: deleted });
  } catch (error) {
    console.error('Error deleting product:', error);
    next(error);
  }
};

// SEARCH
exports.searchProducts = async (req, res, next) => {
  const q = req.params.q || '';
  // Escape regex special characters
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const safeQ = escapeRegex(q);
  try {
    const results = await NewProductModel.find({
      $or: [
        { name: { $regex: safeQ, $options: 'i' } },
        { keywords: { $regex: safeQ, $options: 'i' } },
      ],
    });
    res.status(200).json({ status: 1, data: results });
  } catch (error) {
    next(error);
  }
};
// GET ALL PRODUCTS BY GROUP CODE ID
exports.getProductsByGroupCode = async (req, res, next) => {
  const { groupcodeId } = req.params;

  try {
    const products = await NewProductModel.find({ groupcodeId });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this group code' });
    }

    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching products by groupcodeId:', error);
    next(error);
  }
};

// GET PRODUCTS BY CATEGORY ID
exports.getProductsByCategoryId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({
      newCategoryId: req.params.id,
    });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this category' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by categoryId:', error);
    next(error);
  }
};

// GET PRODUCTS BY STRUCTURE ID
exports.getProductsByStructureId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ structureId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this structure' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by structureId:', error);
    next(error);
  }
};

// GET PRODUCTS BY CONTENT ID
exports.getProductsByContentId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ contentId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this content' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by contentId:', error);
    next(error);
  }
};

// GET PRODUCTS BY FINISH ID
exports.getProductsByFinishId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ finishId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this finish' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by finishId:', error);
    next(error);
  }
};

// GET PRODUCTS BY DESIGN ID
exports.getProductsByDesignId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ designId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this design' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by designId:', error);
    next(error);
  }
};

// GET PRODUCTS BY COLOR ID
exports.getProductsByColorId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ colorId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this color' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by colorId:', error);
    next(error);
  }
};

// GET PRODUCTS BY MOTIF SIZE ID
exports.getProductsByMotifSizeId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ motifsizeId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this motif size' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by motifsizeId:', error);
    next(error);
  }
};

// GET PRODUCTS BY SUITABLE FOR ID
exports.getProductsBySuitableForId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({
      suitableforId: req.params.id,
    });
    if (!products.length)
      return res.status(404).json({
        status: 0,
        message: 'No products found for this suitable for',
      });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by suitableforId:', error);
    next(error);
  }
};

// GET PRODUCTS BY VENDOR ID
exports.getProductsByVendorId = async (req, res, next) => {
  try {
    const products = await NewProductModel.find({ vendorId: req.params.id });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No products found for this vendor' });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    console.error('Error fetching by vendorId:', error);
    next(error);
  }
};

// GET PRODUCT BY PRODUCT IDENTIFIER
exports.getProductByProductIdentifier = async (req, res, next) => {
  try {
    const product = await NewProductModel.findOne({
      productIdentifier: req.params.identifier,
    });
    if (!product)
      return res
        .status(404)
        .json({ status: 0, message: 'No product found with this identifier' });
    res.status(200).json({ status: 1, data: product });
  } catch (error) {
    console.error('Error fetching by productIdentifier:', error);
    next(error);
  }
};

// GET PRODUCTS BY GSM LESS THAN OR EQUAL TO VALUE
exports.getProductsByGsmValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: 'Invalid GSM value' });

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      gsm: { $gte: min, $lte: max },
    });

    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No GSM products found in range' });

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('GSM range error:', error);
    next(error);
  }
};

// 🔸 GET PRODUCTS WHERE oz <= value
exports.getProductsByOzValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: 'Invalid OZ value' });

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      oz: { $gte: min, $lte: max },
    });

    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No OZ products found in range' });

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('OZ range error:', error);
    next(error);
  }
};

// 🔸 GET PRODUCTS WHERE inch <= value
exports.getProductsByInchValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: 'Invalid Inch value' });

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      inch: { $gte: min, $lte: max },
    });

    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No Inch products found in range' });

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('Inch range error:', error);
    next(error);
  }
};

// 🔸 GET PRODUCTS WHERE cm <= value
exports.getProductsByCmValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: 'Invalid CM value' });

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      cm: { $gte: min, $lte: max },
    });

    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No CM products found in range' });

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('CM range error:', error);
    next(error);
  }
};

// 🔸 GET PRODUCTS WHERE salesPrice <= value
exports.getProductsByPriceValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res
        .status(400)
        .json({ status: 0, message: 'Invalid Price value' });

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      salesPrice: { $gte: min, $lte: max },
    });

    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No Price products found in range' });

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('Price range error:', error);
    next(error);
  }
};

// 🔸 GET PRODUCTS WHERE quantity <= value
exports.getProductsByQuantityValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res
        .status(400)
        .json({ status: 0, message: 'Invalid Quantity value' });

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      quantity: { $gte: min, $lte: max },
    });

    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: 'No Quantity products found in range' });

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('Quantity range error:', error);
    next(error);
  }
};
// purchase price

exports.getProductsByPurchasePriceValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value)) {
      return res
        .status(400)
        .json({ status: 0, message: 'Invalid Purchase Price value' });
    }

    const range = value * 0.15;
    const min = value - range;
    const max = value + range;

    const matched = await NewProductModel.find({
      purchasePrice: { $gte: min, $lte: max },
    });

    if (!matched.length) {
      return res.status(404).json({
        status: 0,
        message: 'No products found in ±15% of purchase price: ' + value,
      });
    }

    const identifiers = [...new Set(matched.map((p) => p.productIdentifier))];

    const related = await NewProductModel.find({
      productIdentifier: { $in: identifiers },
    });

    res.status(200).json({ status: 1, data: related });
  } catch (error) {
    console.error('Error fetching by purchase price range:', error);
    next(error);
  }
};
// ✅ GET products where all three flags are 'yes'
const commonFilter = {
  popularproduct: 'yes',
};
const commonFilter1 = {
  productoffer: 'yes',
};
const commonFilter2 = {
  topratedproduct: 'yes',
};

// Get products marked as popular (but apply all three conditions)
exports.getPopularProducts = async (req, res) => {
  try {
    const products = await NewProductModel.find(commonFilter);
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: 'Error fetching popular products' });
  }
};

// Get products marked as offer (but apply all three conditions)
exports.getProductOffers = async (req, res) => {
  try {
    const products = await NewProductModel.find(commonFilter1);
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: 'Error fetching offer products' });
  }
};

// Get products marked as top-rated (but apply all three conditions)
exports.getTopRatedProducts = async (req, res) => {
  try {
    const products = await NewProductModel.find(commonFilter2);
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: 'Error fetching top-rated products' });
  }
};
