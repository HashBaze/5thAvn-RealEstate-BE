require("dotenv").config();
import mongoose from "mongoose";
const mongoUrl = `${process.env.DB_URL}`;
import app from "./app";
import connectDB from "./core/dbConnection";

const PORT = process.env.PORT || 5000;

async function mongodbConnect() {
  try {
    /**
     * this function call use to connect to the database
     */
    await connectDB(mongoUrl);
    app.get("/", (req, res) => {
      res.send("Website is running");
    });
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`);
    });
  } catch (e) {
    console.log("server err", e);
  }
}

mongodbConnect();
