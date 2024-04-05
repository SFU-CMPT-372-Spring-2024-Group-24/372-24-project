const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { File } = require('../db');
const crypto = require('crypto');

const cloudStorage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = cloudStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

function uploadToGCS(callback) {
  return async function (req, res, next) {
    // Compute the hash of the file's content
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

    // Check if a file with the same hash already exists
    const existingFile = await File.findOne({ where: { hash: hash } });

    // If a file with the same hash already exists, use the url of the existing file
    let publicUrl;
    if (existingFile) {
      publicUrl = existingFile.url;
    } else {
      // If a file with the same hash does not exist, upload the file to GCS
      const filename = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', err => {
        console.error('Error uploading file to Google Cloud Storage:', err);
        res.status(500).json({ message: 'Error uploading file to Google Cloud Storage' });
      });

      blobStream.on('finish', () => {
        publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      });

      blobStream.end(req.file.buffer);
    }

    // Create a new file record with the publicUrl and hash
    const file = await File.create({ 
      name: req.file.originalname,
      url: publicUrl,
      type: path.extname(req.file.originalname).slice(1),
      hash: hash 
    });

    // Attach the file record to the request object
    req.file.fileId = file.id;
    req.file.publicUrl = file.url;

    // Call the next middleware
    return callback(req, res, next);
  };
}

module.exports = {
  uploadToGCS,
};