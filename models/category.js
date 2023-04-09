import mongoose from "mongoose";

const schema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "제품유형을 입력해 주세요!!"],
  },
});

export const Category = mongoose.model("Category", schema);
