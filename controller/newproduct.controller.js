const NewProductModel = require('../model/newproductdata');

const getMediaUrl = (filename, type) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:7000';
 
  const path = type === 'video' ? 'uploadvideo' : 'uploadimage';
  return `${BASE_URL}/${filename}`;
};

// CREATE
exports.addProduct = async (req, res, next) => {
  try {
    const files = req.files || {};

    const payload = {
      sku: req.body.sku,
      slug: req.body.slug,
      name: req.body.name,
      newCategoryId: req.body.newCategoryId,
      productdescription:req.body.productdescription,
      popularproduct:req.body.popularproduct,
      productoffer:req.body.productoffer,
      topratedproduct:req.body.topratedproduct,
      
      image: files.image
        ? getMediaUrl(files.image[0].filename, 'image')
        : req.body.image,
      image1: files.image1
        ? getMediaUrl(files.image1[0].filename, 'image')
        : req.body.image1,
      image2: files.image2
        ? getMediaUrl(files.image2[0].filename, 'image')
        : req.body.image2,
      video: files.video
        ? getMediaUrl(files.video[0].filename, 'video')
        : req.body.video,

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
      groupcodeId: req.body.groupcodeId, // ✅ updated
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
    const id = req.params.id.trim();
    const files = req.files || {};

    const updates = {
      sku: req.body.sku,
      slug: req.body.slug,
      name: req.body.name,
      newCategoryId: req.body.newCategoryId,
      productdescription:req.body.productdescription, // new added product description
      popularproduct:req.body.popularproduct,
      productoffer:req.body.productoffer,
      topratedproduct:req.body.topratedproduct,
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
      groupcodeId: req.body.groupcodeId, // ✅ updated
      ...(files.image && {
        image: getMediaUrl(files.image[0].filename, 'image'),
      }),
      ...(files.image1 && {
        image1: getMediaUrl(files.image1[0].filename, 'image'),
      }),
      ...(files.image2 && {
        image2: getMediaUrl(files.image2[0].filename, 'image'),
      }),
      ...(files.video && {
        video: getMediaUrl(files.video[0].filename, 'video'),
      }),

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
    };

    const updated = await NewProductModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ status: 1, data: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
};

// DELETE
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id.trim();
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
  try {
    const results = await NewProductModel.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { keywords: { $regex: q, $options: 'i' } },
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
    res.status(500).json({ status: 0, message: 'Error fetching popular products' });
  }
};

// Get products marked as offer (but apply all three conditions)
exports.getProductOffers = async (req, res) => {
  try {
    const products = await NewProductModel.find(commonFilter1);
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    res.status(500).json({ status: 0, message: 'Error fetching offer products' });
  }
};

// Get products marked as top-rated (but apply all three conditions)
exports.getTopRatedProducts = async (req, res) => {
  try {
    const products = await NewProductModel.find(commonFilter2);
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    res.status(500).json({ status: 0, message: 'Error fetching top-rated products' });
  }
};
