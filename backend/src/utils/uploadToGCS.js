const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { File } = require('../db');

const cloudStorage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = cloudStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

function uploadToGCS(callback) {
  return function (req, res, next) {
    const filename = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
      console.error('Error uploading file to Google Cloud Storage:', err);
      res.status(500).json({ message: 'Error uploading file to Google Cloud Storage' });
    });

    blobStream.on('finish', async () => {
      req.file.publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      try {
        const file = await File.create({
          name: req.file.originalname,
          url: req.file.publicUrl,
          type: path.extname(req.file.originalname).slice(1),
        });

        req.file.fileId = file.id;
        callback(req, res, next);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    blobStream.end(req.file.buffer);
  };
}

module.exports = {
  uploadToGCS,
};