import { Request, Response } from "express";
import ClientTestimonials from "./testimonials.modal";

export const saveTestimonials = async (req: Request, res: Response) => {
  const { picture, name, designation, review } = req.body;

  if (!name || !review) {
    return res
      .status(400)
      .json({ error: "Name and review are required fields." });
  }

  try {
    const newReview = new ClientTestimonials({
      picture,
      name,
      designation,
      review,
    });

    const savedReview = await newReview.save();

    res
      .status(201)
      .json({ message: "Review saved successfully", review: savedReview });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving the review" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const reviews = await ClientTestimonials.find();

    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the reviews" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const review = await ClientTestimonials.findById(id);
    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the review" });
  }
};

export const updateTestimonials = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { picture, name, designation, review } = req.body;

  try {
    const updatedReview = await ClientTestimonials.findByIdAndUpdate(
      id,
      { picture, name, designation, review },
      { new: true }
    );

    res.status(200).json(updatedReview);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the review" });
  }
};

export const deleteTestimonials = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await ClientTestimonials.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the review" });
  }
};

export const updateIsShow = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isShow } = req.body;

  try {
    const updatedReview = await ClientTestimonials.findByIdAndUpdate(
      id,
      { isShow },
      { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the review" });
  }
};

export const getIsShowTestimonials = async (req: Request, res: Response) => {
  try {
    const reviews = await ClientTestimonials.find({ isShow: true });

    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the reviews" });
  }
};