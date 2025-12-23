let mongoose = require('mongoose');
let otpschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  pass: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  mobile_number: {
    type: Number,
    required: true
  },

  otp: {
    type: Number,
    default: null
  },

  otpExpires: {
    type: Date,
    default: null
  },

  isapproved: {
    type: Boolean,
    default: false
  }
});


let otpmodel = mongoose.model('otpmodel',otpschema);

module.exports= otpmodel;