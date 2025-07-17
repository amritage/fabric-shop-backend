const { secret } = require('../config/secret');
const cloudinary = require('../utils/cloudinary');
const { Readable } = require('stream');
const slugify = require('slugify');

// cloudinary Image Upload
// const cloudinaryImageUpload = async (image) => {
//   console.log('image service',image)
//   const uploadRes = await cloudinary.uploader.upload(image, {
//     upload_preset: secret.cloudinary_upload_preset,
//   });
//   return uploadRes;
// };

// Accepts imageBuffer, optional filename, and optional folder
const cloudinaryImageUpload = (
  imageBuffer,
  filename = null,
  folder = null,
  forceFolder = false,
  resourceType = 'image',
) => {
  return new Promise((resolve, reject) => {
    let public_id = undefined;
    let uploadFolder = folder;
    if (filename) {
      // Remove extension and slugify
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      const uniqueSuffix = Date.now();
      const slug = `${slugify(nameWithoutExt, { lower: true, strict: true })}-${uniqueSuffix}`;
      public_id = slug; // Do NOT prepend folder here
    }
    // Always set the folder param if forceFolder is true or folder is provided
    const uploadOptions = {
      resource_type: resourceType,
      upload_preset: secret.cloudinary_upload_preset,
      unique_filename: false, // Do not add random characters
      overwrite: false, // Do not overwrite if exists
      ...(public_id ? { public_id } : {}),
      ...(uploadFolder ? { folder: uploadFolder } : {}),
      ...(resourceType === 'video'
        ? {
            eager: [
              {
                format: 'mp4',
                video_codec: 'av1',
              },
              {
                format: 'jpg',
                width: 400,
                height: 300,
                crop: 'thumb',
                gravity: 'auto',
                quality: 'auto',
              },
            ],
            eager_async: false,
          }
        : {
            format: 'webp',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { fetch_format: 'auto', quality: 'auto' },
            ],
          }),
    };
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};

// cloudinaryImageDelete (still useful for manual/utility use)
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
