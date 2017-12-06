const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring

const eventSchema = new Schema({
  title: String,
  classid: String,
  start: Date,
  end: Date,
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = eventSchema;
