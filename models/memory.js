var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Memory = new Schema({
  dropboxID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    max: 100,
    required: true
  },
  title: {
    type: String,
    max: 100,
    default: "I Love You!"
  },
  memText: {
    type: String,
    default: "This is one of many memories with you I would love to cherish forever."
  },
  date: {
    type: Date,
    default: Date.now()
  },
  size: Number,
  path_lower: String,
  sequence: Number
});

module.exports = mongoose.model("memory", Memory);
