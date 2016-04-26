var express = require('express');
var Meditation = require('../models/meditation');
var router = express.Router();
var s3 = require('s3');
var s3key = process.env.AWS_ACCESS_KEY_ID;
var s3secret = process.env.AWS_SECRET_ACCESS_KEY;
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: s3key,
    secretAccessKey: s3secret,
  },
});
var uploadToS3 = function (req, res){
  // sets up the s3 wrapper to upload to AWS
  var awspath = "meditationappstorage/meditations/" + req.body.title;
  var params = {
    localFile: req.body.audiofile,
    s3Params: {
      Bucket: "meditationappstorage",
      Key: awspath,
      ACL: 'public-read'
    },
  };
  // uploads mp3 file to AWS
  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
              uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
    // format and store aws link
    var title = req.body.title;
    var titleUpdate = title.split(' ').join('+');
    var awsLink = s3.getPublicUrl('meditationappstorage/meditationappstorage/meditations', titleUpdate, 'us-west-2');
    req.body.link = awsLink;
    // create mongo entry for meditation
    Meditation.create(req.body, function(err, meditation) {
      if (err) return res.status(500).send(err);
      res.send(meditation);
    });
  })
}

router.route('/')
  .get(function(req, res) {
    Meditation.find(function(err, meditations) {
      if (err) return res.status(500).send(err);
      res.send(meditations);
    });
  })
  .post(function(req, res) {
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
    Meditation.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    console.log(req.params.id);
    Meditation.findByIdAndRemove(req.params.id, {}, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });
 
module.exports = router;