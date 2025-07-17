const GroupCode = require('../model/groupcode');
const { cloudinaryServices } = require('../services/cloudinary.service');
const path = require('path');

function stripCloudinaryVersion(rawUrl) {
  if (!rawUrl) return null;
  let url;
  if (typeof rawUrl === 'string') {
    url = rawUrl;
  } else if (rawUrl && typeof rawUrl === 'object') {
    url = rawUrl.secure_url || rawUrl.url || rawUrl.public_id || null;
  } else {
    return null;
  }
  if (!url || typeof url !== 'string') {
    return null;
  }
  return url.replace(/\/v\d+\//, '/');
}

function extractVideoUrls(videoResult) {
  let videoUrl = null;
  let videoThumbnailUrl = null;
  if (videoResult && videoResult.eager && videoResult.eager.length > 0) {
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

async function uploadToCloudinary(file, folder) {
  if (!file) return null;
  const baseFilename = file.originalname.split('/').pop();
  const videoExtensions = ['.mkv', '.webm', '.mp4'];
  const ext = path.extname(baseFilename).toLowerCase();
  const isVideo = videoExtensions.includes(ext);
  if (isVideo) {
    return await cloudinaryServices.cloudinaryImageUpload(
      file.buffer,
      baseFilename,
      folder,
      true,
      'video',
    );
  } else {
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
exports.addGroupCode = async (req, res) => {
  const files = req.files || {};
  let imageResult = files.image
    ? await uploadToCloudinary(files.image[0], 'groupcode')
    : stripCloudinaryVersion(req.body.image);
  let videoResult = files.video
    ? await uploadToCloudinary(files.video[0], 'groupcode')
    : stripCloudinaryVersion(req.body.video);
  let imageUrl =
    imageResult && imageResult.secure_url
      ? imageResult.secure_url
      : imageResult;
  let videoUrl = null;
  if (videoResult && typeof videoResult === 'object') {
    const { videoUrl: vUrl } = extractVideoUrls(videoResult);
    videoUrl = vUrl;
  } else {
    videoUrl = videoResult;
  }
  try {
    const group = new GroupCode({
      name: req.body.name,
      image: imageUrl,
      video: videoUrl,
    });
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
  const id = req.params.id.trim();
  const files = req.files || {};
  let updateData = { name: req.body.name };
  try {
    const current = await GroupCode.findById(id);
    if (!current)
      return res.status(404).json({ status: 0, message: 'Not found' });
    if (files.image) {
      const imageResult = await uploadToCloudinary(files.image[0], 'groupcode');
      updateData.image =
        imageResult && imageResult.secure_url
          ? imageResult.secure_url
          : imageResult;
    } else if (req.body.image) {
      const strippedImage = stripCloudinaryVersion(req.body.image);
      if (strippedImage) updateData.image = strippedImage;
    }
    if (files.video) {
      const videoResult = await uploadToCloudinary(files.video[0], 'groupcode');
      if (videoResult && typeof videoResult === 'object') {
        const { videoUrl: vUrl } = extractVideoUrls(videoResult);
        updateData.video = vUrl;
      } else {
        updateData.video = videoResult;
      }
    } else if (req.body.video) {
      const strippedVideo = stripCloudinaryVersion(req.body.video);
      if (strippedVideo) updateData.video = strippedVideo;
    }
    const updated = await GroupCode.findByIdAndUpdate(
      id,
      { $set: updateData },
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
    const NewProductModel = require('../model/newproductdata');
    const associatedProducts = await NewProductModel.find({
      groupcodeId: req.params.id.trim(),
    });
    if (associatedProducts.length > 0) {
      return res.status(400).json({
        error: 'This group code is already in use and cannot be deleted',
        inUse: true,
        productCount: associatedProducts.length,
      });
    }
    const deleted = await GroupCode.findByIdAndDelete(req.params.id.trim());
    if (!deleted)
      return res.status(404).json({ status: 0, message: 'Not found' });
    res.status(200).json({ status: 1, message: 'Deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};
