var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Memory = new Schema({
  name: {
    type: String
  }
});

module.exports = mongoose.model("Memory", Memory);
