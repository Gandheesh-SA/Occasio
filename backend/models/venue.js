import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
});

const Venue = mongoose.model("Venue", venueSchema);

export default Venue;