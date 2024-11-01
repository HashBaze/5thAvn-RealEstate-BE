import express from "express";
import { deleteTestimonials, getAll, getIsShowTestimonials, getOne, saveTestimonials, updateIsShow, updateTestimonials } from "./testimonials.controller";
import adminVerify from "../../../middleware/admin.middlewere";

const testimonialsRouter = express.Router();

testimonialsRouter.post("/create", adminVerify, saveTestimonials);
testimonialsRouter.get("/all", adminVerify, getAll);
testimonialsRouter.get("/one/:id", adminVerify, getOne);
testimonialsRouter.put("/update/:id", adminVerify, updateTestimonials);
testimonialsRouter.delete("/delete/:id", adminVerify, deleteTestimonials);
testimonialsRouter.put("/show/:id", adminVerify, updateIsShow);
testimonialsRouter.get("/is-show", getIsShowTestimonials);

export default testimonialsRouter;
