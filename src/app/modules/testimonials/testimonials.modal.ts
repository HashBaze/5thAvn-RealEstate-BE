import mongoose from "mongoose";

const  ClientTestimonialsSchema = new mongoose.Schema({
  picture: {
    type: String,
    required: false,
    default: "https://via.placeholder.com/150",
  },
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: false,
    default: "Client",
  },
  review: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isShow: {
    type: Boolean,
    default: true,
  },
});

const ClientTestimonials = mongoose.model("ClientTestimonials", ClientTestimonialsSchema);

export default ClientTestimonials;
