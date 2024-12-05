import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  youtubeLink: {
    type: String,
  },
  tags: {
    type: [String],
    required: true,
  },
  description1: {
    type: String,
    required: true,
  },
  description2: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
  additionalImages: [String],
  isShow: {
    type: Boolean,
    required: true,
  },
  blogKey: {
    type: String,
    unique: true,
    default: function () {
      return uuidv4();
    },
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
