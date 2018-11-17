const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  dropboxUserID: String,
  lastLogin: Date,
  lastModified: Date,
  permissionLevel: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("user", UserSchema );
