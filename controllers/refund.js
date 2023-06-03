import { asyncError } from "../middlewares/error.js";
import { Refund } from "../models/refund.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";

export const createRefund = asyncError(async (req, res, next) => {
  const { team, reFundDate, reFundItems, totalValue, totalAmount } = req.body;

  const refund = await Refund.create({
    team,
    user: req.user._id,
    reFundDate,
    reFundItems,
    totalValue,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    message: "ReFund is created successfully",
    refund,
  });
});

export const getMyRefund = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("사용자를 찾을 수 없습니다."), 404);

  const refunds = await Refund.find({ user: req.user._id })
    .sort({
      createdAt: -1,
    })
    .populate({ path: "user", select: "storeName" });

  res.status(200).json({
    success: true,
    refunds,
  });
});

export const getTeamRefund = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { searchDate } = req.body;
  console.log("user.team" + user.team);

  console.log("searchDate: " + searchDate);
  console.log("type of: " + typeof searchDate);
  if (!user) return next(new ErrorHandler("사용자를 찾을 수 없습니다."), 404);

  if (user.role === "dealer")
    return next(
      new ErrorHandler(
        "매니저 이상만 접근할 수 있습니다.!!, 운영자에게 문의하세요!!"
      ),
      403
    );

  const teamRefunds = await Refund.find({
    team: user.team,
    reFundDate: searchDate,
  }).populate({
    path: "user",
    select: "storeName userName team",
  });

  res.status(200).json({ success: true, teamRefunds });
});

export const deleteMyRefund = asyncError(async (req, res, next) => {
  const refund = await Refund.findById(req.params.id);

  if (!refund) return next(new ErrorHandler("반품을 찾을 수 없습니다.!!", 404));
  if (refund.user.toString() !== req.user._id.toString())
    return next(new ErrorHandler("유저가 일치하지 않습니다.!!"), 403);

  await refund.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "주문 삭제를 성공했습니다.!!", refund });
});

export const updateMyRefund = asyncError(async (req, res, next) => {
  const { reFundDate, reFundItems, totalValue, totalAmount } = req.body;

  const refund = await Refund.findById(req.params.id);

  if (refund.user.toString() !== req.user._id.toString())
    return next(new ErrorHandler("생성자가 일치하지 않습니다."), 403);

  if (!refund) return next(new ErrorHandler("반품을 찾을 수 없습니다.!!", 404));

  if (reFundDate) refund.reFundDate = reFundDate;
  if (reFundItems) refund.reFundItems = reFundItems;
  if (totalValue) refund.totalValue = totalValue;
  if (totalAmount) refund.totalAmount = totalAmount;

  await refund.save();

  res
    .status(200)
    .json({ success: true, message: "주문 수정을 성공했습니다.!!" });
});
