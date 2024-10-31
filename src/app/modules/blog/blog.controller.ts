import { Request, Response } from "express";
import { IBlog } from "./blog.interface";
import Blog from "./blog.model";

export const createBlog = async (req: Request, res: Response) => {
  const blogInfo: IBlog = req.body;

  try {
    const {
      title,
      author,
      date,
      coverImage,
      youtubeLink,
      tags,
      description1,
      description2,
      image1,
      image2,
      additionalImages,
      isShow,
    } = blogInfo;

    if (
      !title ||
      !author ||
      !date ||
      !coverImage ||
      !youtubeLink ||
      !tags ||
      !description1 ||
      !description2 ||
      !image1 ||
      !image2
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new blog instance
    const newBlog = new Blog({
      title,
      author,
      date,
      coverImage,
      youtubeLink,
      tags,
      description1,
      description2,
      image1,
      image2,
      additionalImages,
      isShow,
    });

    newBlog.additionalImages = additionalImages || [];
    newBlog.tags = tags || [];
    newBlog.isShow = isShow || false;

    const savedBlog = await newBlog.save();

    return res
      .status(201)
      .json({ message: "Blog created successfully", blog: savedBlog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const blogInfo: IBlog = req.body;

  try {
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const {
      title,
      author,
      date,
      coverImage,
      youtubeLink,
      tags,
      description1,
      description2,
      image1,
      image2,
      additionalImages,
      isShow,
    } = blogInfo;

    if (
      !title &&
      !author &&
      !date &&
      !coverImage &&
      !youtubeLink &&
      !tags &&
      !description1 &&
      !description2 &&
      !image1 &&
      !image2
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    if (title) existingBlog.title = title;
    if (author) existingBlog.author = author;
    if (date) existingBlog.date = date;
    if (coverImage) existingBlog.coverImage = coverImage;
    if (youtubeLink) existingBlog.youtubeLink = youtubeLink;
    if (tags) existingBlog.tags = tags;
    if (description1) existingBlog.description1 = description1;
    if (description2) existingBlog.description2 = description2;
    if (image1) existingBlog.image1 = image1;
    if (image2) existingBlog.image2 = image2;
    if (additionalImages) existingBlog.additionalImages = additionalImages;
    if (isShow !== undefined) existingBlog.isShow = isShow;

    const updatedBlog = await existingBlog.save();

    return res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateIsShow = async (req: Request, res: Response) => {
  try {
    const { id, isShow } = req.params;

    if (isShow !== "true" && isShow !== "false") {
      return res.status(400).json({ message: "isShow must be true or false" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { isShow },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ message: "isShow updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlogsByPagination = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ isShow: true }).skip(skip).limit(limit);

    const totalBlogs = await Blog.countDocuments({ isShow: true });

    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json({
      message: "Blogs fetched successfully",
      page,
      totalPages,
      limit,
      totalBlogs,
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isShow: true }).sort({ date: -1 }).limit(3);

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUniqueTags = async (req: Request, res: Response) => {
  try {
    const tags = await Blog.distinct("tags");
    return res.status(200).json(tags); 
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchBlogsByTags = async (req: Request, res: Response) => {
  try {
    const { tags } = req.body;

    if (!tags || tags.length === 0) {
      return res.status(400).json({ message: "Tags are required" });
    }

    const blogs = await Blog.find({ tags: { $in: tags } });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}