import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // 신제품 : 1~10
  // 봉지면 : 11~100
  // 용기면 : 101~200
  // 스낵류 : 201~300
  // 소스류 : 301~400
  // 즉석식품 : 401~500
  // 기타 : 501~600

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
  images: [{ public_id: String, url: String }],
  barcode: [{ public_id: String, url: String }],
  category: {
    type: String,
    enum: ["봉지면", "용기면", "스낵류", "소스류", "즉석식품", "기타"],
    required: [true, "카테고리를 입력해 주세요"],
  },
  newproduct: {
    type: Boolean,
    default: false,
  },
  createAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", schema);
