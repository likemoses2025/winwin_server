import { asyncError } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";

export const createOrder = asyncError(async (req, res, next) => {
  const {
    team,
    deliveryDate,
    deliveryPlace,
    orderItems,
    totalBox,
    totalAmount,
    createdAt,
  } = req.body;

  const order = await Order.create({
    team,
    user: req.user._id,
    deliveryDate,
    deliveryPlace,
    orderItems,
    totalBox,
    totalAmount,
    createdAt,
  });

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
    order,
  });
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({
      createdAt: -1,
    })
    .populate({ path: "user", select: "storeName" });

  res.status(200).json({
    success: true,
    orders,
  });
});

export const getTeamOrder = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("사용자를 찾을 수 없습니다."), 404);

  if (user.role === "dealer")
    return next(
      new ErrorHandler(
        "매니저 이상만 접근할 수 있습니다.!!, 운영자에게 문의하세요!!"
      ),
      403
    );

  const teamOrders = await Order.find({ team: user.team }).populate({
    path: "user",
    select: "storeName userName team",
  });

  res.status(200).json({ success: true, teamOrders });
});

export const deleteMyOrder = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("주문를 찾을 수 없습니다.!!", 404));
  if (order.user.toString() !== req.user._id.toString())
    return next(new ErrorHandler("유저가 일치하지 않습니다.!!"), 403);

  await order.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "주문 삭제를 성공했습니다.!!" });
});

export const updateMyOrder = asyncError(async (req, res, next) => {
  const {
    team,
    deliveryPlace,
    deliveryDate,
    orderItems,
    totalBox,
    totalAmount,
    createdAt,
  } = req.body;

  const order = await Order.findById(req.params.id);

  if (order.user.toString() !== req.user._id.toString())
    return next(new ErrorHandler("생성자가 일치하지 않습니다."), 403);

  if (!order) return next(new ErrorHandler("주문를 찾을 수 없습니다.!!", 404));

  if (team) order.team = team;
  if (deliveryDate) order.deliveryDate = deliveryDate;
  if (deliveryPlace) order.deliveryPlace = deliveryPlace;
  if (totalBox) order.totalBox = totalBox;
  if (orderItems) order.orderItems = orderItems;
  if (totalAmount) order.totalAmount = totalAmount;
  if (createdAt) order.createdAt = createdAt;

  await order.save();

  res
    .status(200)
    .json({ success: true, message: "주문 수정을 성공했습니다.!!" });
});
