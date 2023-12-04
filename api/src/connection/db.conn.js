import mongoose from "mongoose";

export const connectToDatabase = (URI) => {
  mongoose
    .connect(URI)
    .then(() => {
      console.log(`Connected to database`);
    })
    .catch((err) => {
      console.log(err);
    });
};
