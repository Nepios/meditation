var mongoose = require('mongoose');

var MeditationSchema = new mongoose.Schema({
  title: String,
  description: String,
  mp3: String,
  author: String
});

module.exports = mongoose.model('Meditation', MeditationSchema);