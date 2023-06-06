import mongoose from "mongoose";

// 유저 모델에 오더 ObjectId 삽입

const schema = new mongoose.Schema({
  team: { type: String, required: true },
  deliveryDate: Date,
  deliveryPlace: {
    type: String,
    required: true,
  },
  // 유저정보에 배송장소를 등록하고 _id를 통하여 배송장소를 불러옴
  // deliveryPlace: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },

  orderItems: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalBox: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

export const Order = mongoose.model("Order", schema);
