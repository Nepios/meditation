var express = require('express');
var Meditation = require('../models/meditation');
var router = express.Router();
var skipperS3 = require('skipper-s3');
var s3 = require('s3');
var s3key = process.env.AWS_ACCESS_KEY_ID;
var s3secret = process.env.AWS_SECRET_ACCESS_KEY;
var AWS = require('aws-sdk'); 
var AWSs3 = new AWS.S3(); 

router.route('/')
  .get(function(req, res) {
    Meditation.find(function(err, meditations) {
      console.log(err);
      if (err) return res.status(500).send(err);

      res.send(meditations);
    });
  })
  .post(function(req, res) {
    var s3 = require('s3');
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
    console.log(`meditationappstorage/meditations/${req.body.title}`);
    var params = {
      localFile: req.body.audiofile,

      s3Params: {
        Bucket: "meditationappstorage",
        Key: `meditationappstorage/meditations/${req.body.title}`,
        ACL: 'public-read'
      },
    };
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
      // Meditation.create(req.body, function(err, meditations) {
      //   if (err) return res.status(500).send(err);
      //   console.log(results)
      //   res.send(meditation);
    });
  });

//         var mp3 = results.files[0].extra.Location;
//         Meditation.create(req.body, function(err, meditations) {
//           if (err) return res.status(500).send(err);
//           console.log(results)
//           res.send(meditation);
//         });
//       };
//     });
// }
//   });

router.get('/:id', function(req, res) {
  Meditation.findById(req.params.id, function(err, meditation) {
    if (err) return res.status(500).send(err);
    res.send(meditation);
  })
  .put(function(req, res) {
    Recipe.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    Recipe.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });
});

module.exports = router;