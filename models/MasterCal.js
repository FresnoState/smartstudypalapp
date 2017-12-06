const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring
const EventSchema = require('./Event');

const calendarSchema = new Schema({
  courseID: String,
  openstudy: [EventSchema]
});

mongoose.model('masterCal', calendarSchema); //creating the studysessions collection
