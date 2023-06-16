import mongoose from "mongoose";

// 유저 모델에 refund ObjectId 삽입

const schema = new mongoose.Schema(
  {
    storeCode: { type: String, required: true },
    team: { type: String, required: true },
    // 2301,2302,2303,2304
    refundDate: { type: String, required: true },
    refundItems: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalValue: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Refund = mongoose.model("Refund", schema);
