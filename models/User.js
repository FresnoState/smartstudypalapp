const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring
const EventSchema = require('./Event');

const userSchema = new Schema({
  googleId: String,
  email: String,
  courses: []
});

mongoose.model('users', userSchema); //creating the users collection
