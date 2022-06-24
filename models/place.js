const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  //mongoose.Types.ObjectId : tell MongoDB that this is a real MongoDB Object
  // ref : to establish connection between our current schema and another one
});

module.exports = mongoose.model("Place", placeSchema);
