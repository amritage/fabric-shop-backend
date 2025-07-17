const NewProductModel = require('../model/newproductdata');
const { cloudinaryServices } = require('../services/cloudinary.service');
const NewCategoryModel = require('../model/newcategorydata');
const { deleteImagesFromCloudinary } = require('../utils/cloudinary');
const slugify = require('slugify');
const path = require('path');

function stripCloudinaryVersion(rawUrl) {
  if (!rawUrl) return null;

  // Debug logging to see what we're receiving
  console.log('stripCloudinaryVersion input:', rawUrl, typeof rawUrl);

  // Handle different types of input
  let url;
  if (typeof rawUrl === 'string') {
    url = rawUrl;
  } else if (rawUrl && typeof rawUrl === 'object') {
    // If it's a Cloudinary result object, extract the URL
    url = rawUrl.secure_url || rawUrl.url || rawUrl.public_id || null;
  } else {
    // If it's not a string or object, return null
    console.log(
      'Invalid input type for stripCloudinaryVersion:',
      typeof rawUrl,
    );
    return null;
  }

  // If we still don't have a valid URL, return null
  if (!url || typeof url !== 'string') {
    console.log('No valid URL extracted from input');
    return null;
  }

  // Strip the version number from Cloudinary URL
  return url.replace(/\/v\d+\//, '/');
}

// Helper to extract video and thumbnail URLs from Cloudinary result
function extractVideoUrls(videoResult) {
  let videoUrl = null;
  let videoThumbnailUrl = null;

  if (videoResult && videoResult.eager && videoResult.eager.length > 0) {
    // Get the AV1 video URL
    if (
      videoResult.eager[0].secure_url &&
      videoResult.eager[0].secure_url.includes('/vc_av1/')
    ) {
      videoUrl = videoResult.eager[0].secure_url;
    } else if (videoResult.secure_url) {
      videoUrl = videoResult.secure_url;
    } else {
      videoUrl = videoResult;
    }

    // Get the thumbnail URL (second eager transformation)
    if (videoResult.eager[1] && videoResult.eager[1].secure_url) {
      videoThumbnailUrl = videoResult.eager[1].secure_url;
    }
  } else if (videoResult && videoResult.secure_url) {
    videoUrl = videoResult.secure_url;
  } else {
    videoUrl = videoResult;
  }

  return { videoUrl, videoThumbnailUrl };
}

// Helper to upload a file buffer to Cloudinary and return the URL
async function uploadToCloudinary(file, folder) {
  if (!file) return null;
  // Use only the base filename to avoid double folder nesting
  const baseFilename = file.originalname.split('/').pop();

  // Detect if this is a video file (AV1 only)
  const videoExtensions = ['.mkv', '.webm', '.mp4'];
  const ext = path.extname(baseFilename).toLowerCase();
  const isVideo = videoExtensions.includes(ext);

  // Only allow AV1 video files (by extension and mimetype)
  if (isVideo) {
    // Optionally, check mimetype for AV1 (may be 'video/mp4', 'video/webm', etc.)
    // You can add more robust AV1 detection if needed
    return await cloudinaryServices.cloudinaryImageUpload(
      file.buffer,
      baseFilename,
      folder,
      true,
      'video',
    );
  } else {
    // Image upload
    return await cloudinaryServices.cloudinaryImageUpload(
      file.buffer,
      baseFilename,
      folder,
      true,
      'image',
    );
  }
}

// CREATE
exports.addProduct = async (req, res, next) => {
  try {
    const files = req.files || {};

    // Debug logging to see what's in the request body
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Image fields in body:', {
      image: req.body.image,
      image1: req.body.image1,
      image2: req.body.image2,
      video: req.body.video,
    });

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

    // Upload images/videos to Cloudinary and store only the URL
    const imageResult = files.image
      ? await uploadToCloudinary(files.image[0], folderName)
      : stripCloudinaryVersion(req.body.image);
    const image1Result = files.image1
      ? await uploadToCloudinary(files.image1[0], folderName)
      : stripCloudinaryVersion(req.body.image1);
    const image2Result = files.image2
      ? await uploadToCloudinary(files.image2[0], folderName)
      : stripCloudinaryVersion(req.body.image2);
    const videoResult = files.video
      ? await uploadToCloudinary(files.video[0], folderName)
      : stripCloudinaryVersion(req.body.video);

    // Extract video and thumbnail URLs
    const { videoUrl, videoThumbnailUrl } = extractVideoUrls(videoResult);

    const payload = {
      sku: req.body.sku,
      slug: req.body.slug,
      name: req.body.name,
      newCategoryId: req.body.newCategoryId,
      productdescription: req.body.productdescription,
      popularproduct: req.body.popularproduct,
      productoffer: req.body.productoffer,
      topratedproduct: req.body.topratedproduct,
      image:
        imageResult && imageResult.secure_url
          ? imageResult.secure_url
          : imageResult,
      image1:
        image1Result && image1Result.secure_url
          ? image1Result.secure_url
          : image1Result,
      image2:
        image2Result && image2Result.secure_url
          ? image2Result.secure_url
          : image2Result,
      video: videoUrl,
      videoThumbnail: videoThumbnailUrl,
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
      // --- SEO/Meta Extensions ---
      openGraph: {
        images: req.body.openGraph_images
          ? Array.isArray(req.body.openGraph_images)
            ? req.body.openGraph_images
            : [req.body.openGraph_images]
          : [],
        video: req.body.openGraph_video || '',
      },
      twitter: {
        image: req.body.twitter_image || '',
        player: req.body.twitter_player || '',
        player_width: req.body.twitter_player_width
          ? Number(req.body.twitter_player_width)
          : undefined,
        player_height: req.body.twitter_player_height
          ? Number(req.body.twitter_player_height)
          : undefined,
      },
      VideoJsonLd: req.body.VideoJsonLd
        ? JSON.parse(req.body.VideoJsonLd)
        : undefined,
      LogoJsonLd: req.body.LogoJsonLd
        ? JSON.parse(req.body.LogoJsonLd)
        : undefined,
      BreadcrumbJsonLd: req.body.BreadcrumbJsonLd
        ? JSON.parse(req.body.BreadcrumbJsonLd)
        : undefined,
      LocalBusinessJsonLd: req.body.LocalBusinessJsonLd
        ? JSON.parse(req.body.LocalBusinessJsonLd)
        : undefined,
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

    // Debug logging to see what's in the request body
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Image fields in body:', {
      image: req.body.image,
      image1: req.body.image1,
      image2: req.body.image2,
      video: req.body.video,
    });

    // Get the current product to check old images
    const currentProduct = await NewProductModel.findById(id);
    if (!currentProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

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

    // Track old images that need to be deleted
    const oldImagesToDelete = [];

    // Initialize updates object
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
      // --- SEO/Meta Extensions ---
      openGraph: {
        images: req.body.openGraph_images
          ? Array.isArray(req.body.openGraph_images)
            ? req.body.openGraph_images
            : [req.body.openGraph_images]
          : [],
        video: req.body.openGraph_video || '',
      },
      twitter: {
        image: req.body.twitter_image || '',
        player: req.body.twitter_player || '',
        player_width: req.body.twitter_player_width
          ? Number(req.body.twitter_player_width)
          : undefined,
        player_height: req.body.twitter_player_height
          ? Number(req.body.twitter_player_height)
          : undefined,
      },
      VideoJsonLd: req.body.VideoJsonLd
        ? JSON.parse(req.body.VideoJsonLd)
        : undefined,
      LogoJsonLd: req.body.LogoJsonLd
        ? JSON.parse(req.body.LogoJsonLd)
        : undefined,
      BreadcrumbJsonLd: req.body.BreadcrumbJsonLd
        ? JSON.parse(req.body.BreadcrumbJsonLd)
        : undefined,
      LocalBusinessJsonLd: req.body.LocalBusinessJsonLd
        ? JSON.parse(req.body.LocalBusinessJsonLd)
        : undefined,
    };

    // Handle image updates and track old images
    function getCloudinaryUrl(result) {
      if (!result) return null;
      if (typeof result === 'string') return result;
      if (result.secure_url) return result.secure_url;
      return null;
    }

    if (files.image) {
      if (currentProduct.image) {
        oldImagesToDelete.push(currentProduct.image);
      }
      const imageResult = await uploadToCloudinary(files.image[0], folderName);
      updates.image = getCloudinaryUrl(imageResult);
    } else if (req.body.image) {
      const strippedImage = stripCloudinaryVersion(req.body.image);
      if (strippedImage) {
        updates.image = strippedImage;
      }
    }

    if (files.image1) {
      if (currentProduct.image1) {
        oldImagesToDelete.push(currentProduct.image1);
      }
      const image1Result = await uploadToCloudinary(
        files.image1[0],
        folderName,
      );
      updates.image1 = getCloudinaryUrl(image1Result);
    } else if (req.body.image1) {
      const strippedImage1 = stripCloudinaryVersion(req.body.image1);
      if (strippedImage1) {
        updates.image1 = strippedImage1;
      }
    }

    if (files.image2) {
      if (currentProduct.image2) {
        oldImagesToDelete.push(currentProduct.image2);
      }
      const image2Result = await uploadToCloudinary(
        files.image2[0],
        folderName,
      );
      updates.image2 = getCloudinaryUrl(image2Result);
    } else if (req.body.image2) {
      const strippedImage2 = stripCloudinaryVersion(req.body.image2);
      if (strippedImage2) {
        updates.image2 = strippedImage2;
      }
    }

    // Video update: always use AV1 eager transformation URL if available
    if (files.video) {
      if (currentProduct.video) {
        oldImagesToDelete.push(currentProduct.video);
      }
      if (currentProduct.videoThumbnail) {
        oldImagesToDelete.push(currentProduct.videoThumbnail);
      }
      const videoResult = await uploadToCloudinary(files.video[0], folderName);
      const { videoUrl, videoThumbnailUrl } = extractVideoUrls(videoResult);
      updates.video = videoUrl;
      updates.videoThumbnail = videoThumbnailUrl;
    } else if (req.body.video) {
      const strippedVideo = stripCloudinaryVersion(req.body.video);
      if (strippedVideo) {
        updates.video = strippedVideo;
      }
    }

    const updated = await NewProductModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    // Delete old images from Cloudinary
    if (oldImagesToDelete.length > 0) {
      try {
        await deleteImagesFromCloudinary(oldImagesToDelete);
        console.log(
          `Successfully deleted ${oldImagesToDelete.length} old images for product ID: ${id}`,
        );
      } catch (cloudinaryError) {
        console.error(
          'Error deleting old images from Cloudinary:',
          cloudinaryError,
        );
        // Don't fail the request if Cloudinary deletion fails
      }
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

    // First, get the product to access its images
    const product = await NewProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product from database
    const deleted = await NewProductModel.findByIdAndDelete(id);

    // (Cloudinary image deletion code removed)

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
// GET PRODUCT BY SLUG
exports.getProductBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const product = await NewProductModel.findOne({ slug });

    if (!product) {
      return res.status(404).json({ status: 0, message: 'Product not found' });
    }

    res.status(200).json({ status: 1, data: product });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    next(error);
  }
};
