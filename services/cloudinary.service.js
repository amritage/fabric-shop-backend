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
const cloudinaryImageUpload = (imageBuffer, filename = null, folder = null) => {
  return new Promise((resolve, reject) => {
    let public_id = undefined;
    if (filename) {
      // Remove extension and slugify
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      const uniqueSuffix = Date.now();
      const slug = `${slugify(nameWithoutExt, { lower: true, strict: true })}-${uniqueSuffix}`;
      public_id = folder ? `${folder}/${slug}` : slug;
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: secret.cloudinary_upload_preset,
        format: 'avif',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
        ...(public_id ? { public_id } : {}),
        unique_filename: false, // Do not add random characters
        overwrite: false, // Do not overwrite if exists
      },
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

// cloudinaryImageDelete
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
