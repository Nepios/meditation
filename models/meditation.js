var mongoose = require('mongoose');

var MeditationSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Meditation', MeditationSchema);