const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    min : 6,
    max : 255,
  },
  email : {
    type : String,
    require : true,
    max : 100,
    unique : true, 
  },
  password : {
    type : String,
    required : true,
    min : 8,
  }
});

module.exports = mongoose.model("User",userSchema);