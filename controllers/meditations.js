var express = require('express');
var Meditation = require('../models/meditation');
var router = express.Router();
var { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
var fs = require('fs');
var multer = require('multer');

// Configure multer for file uploads
var upload = multer({ dest: 'uploads/' });

var s3Client = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});
var uploadToS3 = async function (req, res){
  try {
    // Upload to S3 using modern AWS SDK
    var awspath = "meditations/" + req.body.title.replace(/\s+/g, '_');
    var fileStream = fs.readFileSync(req.file.path);
    
    var params = {
      Bucket: "meditationappstorage",
      Key: awspath,
      Body: fileStream,
      ContentType: 'audio/mpeg',
      ACL: 'public-read'
    };
    
    var command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    console.log("done uploading");
    
    // Create AWS link
    var awsLink = `https://s3-us-west-2.amazonaws.com/meditationappstorage/${awspath}`;
    req.body.link = awsLink;
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    // Create mongo entry for meditation
    Meditation.create(req.body, function(err, meditation) {
      if (err) return res.status(500).send(err);
      res.send(meditation);
    });
  } catch (err) {
    console.error("unable to upload:", err);
    res.status(500).send({error: 'Upload failed'});
  }
}

router.route('/')
  .get(function(req, res) {
    Meditation.find(function(err, meditations) {
      if (err) return res.status(500).send(err);
      res.send(meditations);
    });
  })
  .post(upload.single('audiofile'), function(req, res) {
    uploadToS3(req, res);
  })

router.route('/mood/:mood')
  .get(function(req, res) {
    console.log("mood router is running");
    Meditation.find({emotion: req.params.mood}, function(err, meditation) {
      if (err) return res.status(500).send(err);
      res.send(meditation);
    })
 })

router.route('/:id')
  .get(function(req, res) {
    Meditation.findById(req.params.id, function(err, meditation) {
      if (err) return res.status(500).send(err);
      res.send(meditation);
    })
   })
  .put(function(req, res) {
    Meditation.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, meditation) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    console.log(req.params.id);
    Meditation.findByIdAndDelete(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });
 
module.exports = router;