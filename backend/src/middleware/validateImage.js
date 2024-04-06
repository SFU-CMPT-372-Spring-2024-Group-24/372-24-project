const sharp = require('sharp');

// Function to validate if a file is an image
function validateImage(req, res, next) {
  // Check if the request contains a file
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Check the file type
  const fileType = req.file.mimetype.split('/')[1];
  if (!['jpeg', 'png', 'webp', 'gif', 'svg+xml', 'avif', 'tiff'].includes(fileType)) {
    return res.status(400).json({ message: 'Invalid file type. Only .jpg, .png, .webp, .tiff, .gif files are allowed.' });
  }

  // Check again if the file is an image using sharp
  sharp(req.file.buffer).metadata().then(() => {
    next();
  }).catch((error) => {
    return res.status(400).json({ message: 'An error occurred while uploading the file. Please try again.'});
  });
};

module.exports = validateImage;
