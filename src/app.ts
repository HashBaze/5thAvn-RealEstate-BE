import express, { Application } from "express";
import cors from "cors";
import mailRoute from "./email/mail.route";


const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/mail", mailRoute);

export default app;