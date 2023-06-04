import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  team: {
    type: String,
    default: "경북팀",
    required: [true, "팀명을 입력해 주세요"],
  },

  channel: {
    type: String,
    enum: ["특약점", "중대형마트", "유통기타", "온라인", "기타"],
    default: "특약점",
    required: [true, "채널명을 입력해 주세요"],
  },
  email: {
    type: String,
    required: [true, "이메일을 입력해 주세요!!"],
    unique: [true, "이메일이 존재합니다. 다른 이메일을 입력해 주세요!!"],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "패스워드를 입력해 주세요!!"],
    minLength: [6, "패스워드를 6글자 이상 입력해 주세요!!"],
    // 사용자 정보를 요청할때 제외됨.
    select: false,
  },
  userName: {
    type: String,
    required: [true, "점주님의 이름을 입력해 주세요!!"],
  },
  sapCode: {
    type: String,
    unique: [true, "코드가 존재합니다. SapCode를 확인해 주세요!!"],
  },
  storeName: {
    type: String,
    required: [true, "점포명을 입력해 주세요!!"],
    unique: [true, "점포명이 존재합니다. 다른 점포명을 입력해 주세요!!"],
  },
  deliveryPlace: [
    {
      name: { type: String },
      address: { type: String },
    },
  ],
  phoneNumber: {
    type: String,
    required: [true, "휴대폰 번호를 입력해 주세요!!"],
  },
  role: {
    type: String,
    enum: ["admin", "dealer", "manager"],
    default: "dealer",
  },
  avatar: {
    public_id: String,
    url: String,
  },
  approve: {
    type: String,
    required: [
      true,
      "관리자의 승인이 필요합니다!! 승인까지 시간이 걸릴 수 있습니다.",
    ],
    default: "false",
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  ],
  otp: Number,
  otp_expire: Date,
});

schema.pre("save", async function (next) {
  // 패스워드 변경이 아닌경우 bcrypt 해쉬 기능을 넘긴다.
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

export const User = mongoose.model("User", schema);
