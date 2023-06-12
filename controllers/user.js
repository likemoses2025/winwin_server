import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import {
  cookieOptions,
  getDataUri,
  sendEmail,
  sendToken,
} from "../utils/features.js";
import cloudinary from "cloudinary";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (!user)
    return next(new ErrorHandler("Incorrect Password or Email !!", 400));

  if (!password) {
    return next(new ErrorHandler("Please enter password", 400));
  }

  // Handle Error
  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Password or Email !!", 400));
  }
  sendToken(user, res, `Welcome Back ${user.userName}`, 200);
});

export const signup = asyncError(async (req, res, next) => {
  const {
    team,
    channel,
    email,
    password,
    userName,
    storeCode,
    storeName,
    storeAddress,
    phoneNumber,
  } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return next(
      new ErrorHandler(
        "이메일이 존재합니다.!! 다른 이메일을 입력해 주세요!!",
        400
      )
    );

  let avatar = undefined;

  if (req.file) {
    const file = getDataUri(req.file);
    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
  }

  user = await User.create({
    team,
    channel,
    email,
    password,
    userName,
    storeCode,
    storeName,
    storeAddress,
    phoneNumber,
    avatar,
  });

  sendToken(user, res, `회원가입에 성공했습니다 !!`, 201);
});

export const logOut = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "로그아웃을 성공했습니다.!!",
    });
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const {
    team,
    channel,
    email,
    userName,
    storeCode,
    storeName,
    storeAddress,
    phoneNumber,
  } = req.body;

  if (team) user.team = team;
  if (channel) user.channel = channel;
  if (email) user.email = email;
  if (userName) user.userName = userName;
  if (storeName) user.storeName = storeName;
  if (storeCode) user.storeCode = storeCode;
  if (storeAddress) user.storeAddress = storeAddress;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();

  res.status(200).json({
    success: true,
    message: "프로필 변경을 성공했습니다.!!",
    user,
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("이전 패스워드와 새로운 패스워드를 입력해 주세요!!", 400)
    );
  }

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched)
    return next(new ErrorHandler("이전 패스워드가 일치하지 않습니다.!!", 400));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "패스워드 변경을 성공했습니다.!!",
  });
});

export const updatePic = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const file = getDataUri(req.file);

  // 클라우드 이미지 삭제
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  // 클라우드 이미지 등록
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  console.log("mycloud", myCloud);
  user.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };

  await user.save();

  res.status(200).json({
    success: true,
    message: "프로필 이미지 변경을 성공했습니다!!",
  });
});

export const forgetPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Incorrect Email", 404));

  // Max,Min 2000,10000
  // math.random()*(max-min)+min
  const randomNumber = Math.random() * (999999 - 100000) + 100000;
  const otp = Math.floor(randomNumber);

  // otp Expire = 15min
  const otp_expire = 15 * 60 * 1000;

  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);
  await user.save();

  const message = `패스워드 변경을 위한 OTP번호는 ${otp}. \n Please Ignore If you Haven't requested this.`;

  try {
    await sendEmail("패스워드 변경을 위한 OTP Number", user.email, message);
  } catch (error) {
    user.otp = null;
    user.otp_expire = null;
    await user.save();
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: `OTP번호를 ${user.email} 로 보냈습니다.`,
  });
});

export const resetPassword = asyncError(async (req, res, next) => {
  const { otp, password } = req.body;

  const user = await User.findOne({
    otp, //otp 번호가 같고
    otp_expire: { $gt: Date.now() }, //현재시간보다 큰 otp_expire 찾기
  });

  if (!user)
    return next(
      new ErrorHandler(
        "OTP번호가 일치하지 않거나 유효기간이 만료되었습니다.!!",
        400
      )
    );

  if (!password)
    return next(new ErrorHandler("새로운 패스워드를 입력해 주세요!!"));

  user.password = password;
  user.otp = undefined;
  user.otp_expire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "패스워드 변경을 성공했습니다. 이제 로그인이 가능합니다.!!",
  });
});

export const addPlace = asyncError(async (req, res, next) => {
  const place = req.body;
  const user = await User.findById(req.user._id);

  if (!user)
    return next(
      ErrorHandler("유저를 찾을수 없습니다.!! 이메일을 확인하세요", 404)
    );

  user.deliveryPlace.push(place);
  await user.save();

  res.status(200).json({ success: true, message: "배송장소를 등록했습니다!!" });
});

export const deletePlace = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler("유저를 찾을 수 없습니다.!!", 404));

  const id = req.params.id;

  if (!id) return next(new ErrorHandler("배송장소를 찾을 수 없습니다.!!", 404));

  let isExist = -1;
  user.deliveryPlace.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  if (isExist === -1)
    return next(new ErrorHandler("배송장소를 찾을 수 없습니다!!"), 404);

  user.deliveryPlace.splice(isExist, 1);

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "배송장소 삭제를 성공했습니다.!!" });
});
