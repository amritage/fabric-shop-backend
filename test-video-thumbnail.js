const cloudinary = require('./utils/cloudinary');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

// Test function to upload a video and check if thumbnail is generated
async function testVideoThumbnail() {
  try {
    // Create a test video buffer (you would replace this with actual video file)
    const testVideoPath = './test-video.mp4'; // Replace with actual video file path

    if (!fs.existsSync(testVideoPath)) {
      console.log(
        'Test video file not found. Please provide a test video file.',
      );
      return;
    }

    const videoBuffer = fs.readFileSync(testVideoPath);

    // Upload options with thumbnail generation
    const uploadOptions = {
      resource_type: 'video',
      upload_preset:
        process.env.CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset',
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
    };

    console.log('Uploading video to Cloudinary...');

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
        } else {
          console.log('Upload successful!');
          console.log('Original video URL:', result.secure_url);
          console.log('Eager transformations:', result.eager);

          if (result.eager && result.eager.length > 0) {
            console.log('AV1 video URL:', result.eager[0].secure_url);
            if (result.eager[1]) {
              console.log('Thumbnail URL:', result.eager[1].secure_url);
            }
          }
        }
      },
    );

    const bufferStream = new Readable();
    bufferStream.push(videoBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testVideoThumbnail();
