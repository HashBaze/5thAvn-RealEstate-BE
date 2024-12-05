import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import mailRoute from "./email/mail.route";
import userRouter from "./app/modules/user/user.route";
import blogRouter from "./app/modules/blog/blog.route";
import testimonialsRouter from "./app/modules/testimonials/testimonials.route";
import graphqlRouter from "./app/modules/graphql/graphql.route";
import { httpMiddlewere } from "./middleware/httpMiddlewere";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(httpMiddlewere);

app.use("/mail", mailRoute);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/testimonials", testimonialsRouter);
app.use("/graphql", graphqlRouter);

export default app;
