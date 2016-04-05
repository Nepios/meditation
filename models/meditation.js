var mongoose = require('mongoose');

var MeditationSchema = new mongoose.Schema({
  title: String,
  description: String,
  audiofile: String,
  link: String,
  author: String,
  duration: Number,
  emotion: Number
});

module.exports = mongoose.model('Meditation', MeditationSchema);