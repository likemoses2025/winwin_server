import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // NewProduct : 1~100
  // Noodle : 101~200
  // CupNoodle : 201~300
  // Snack : 301~400
  // Sauce no : 401~500
  // etc no : 501~600

  no: {
    type: Number,
    required: true,
    unique: [true, "No가 존재합니다. No를 확인해 주세요!!"],
  },
  name: { type: String, required: [true, "제품명을 입력해 주세요!!"] },
  code: {
    type: String,
    required: [true, "SapCode를 입력해 주세요!!"],
    unique: [true, "코드가 존재합니다. 코드를 확인해 주세요!!"],
  },
  price: { type: Number, required: [true, "가격을 입력해 주세요!!"] },
  orderValue: { type: Number },
  sum: { type: Number },
  images: [{ public_id: String, url: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", schema);
