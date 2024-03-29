var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Memory = new Schema({
  dropboxID: {
    type: String,
    required: true
  },
  dropboxUserID: String,
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
  note: {
    type: String,
    default: "This is one of many memories with you I would love to cherish forever."
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  lastModified: {
    type: Date,
    default: Date.now()
  },
  size: Number,
  path_lower: String,
  sequence: Number
});

module.exports = mongoose.model("memory", Memory);
