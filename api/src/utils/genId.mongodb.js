import mongoose from "mongoose";

export const genObjectId = async () => {
  try {
    const newObjectId = new mongoose.Types.ObjectId();
    return newObjectId.toHexString();
  } catch (err) {
    throw err;
  }
};
