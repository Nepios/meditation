var express = require('express');
var User = require('../models/meditation');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Meditation.find(function(err, meditations) {
      if (err) return res.status(500).send(err);
      res.send(meditations);
    });
  })
  .post(function(req, res) {
    Meditation.create(req.body, function(err, meditations) {
      if (err) return res.status(500).send(err);
      res.send(mediation);
    });
  });

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