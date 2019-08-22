const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    element:{type: String, required: true},
    headline: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    people: [{
      type: Schema.Types.ObjectId,
      ref: "users"
    }],
    cleaner: {
      type: Schema.Types.ObjectId, ref: "users"
    }
});

module.exports = mongoose.model("event", eventSchema, "events");