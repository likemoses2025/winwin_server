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
  } = req.body;

  const order = await Order.create({
    team,
    user: req.user._id,
    deliveryDate,
    deliveryPlace,
    orderItems,
    totalBox,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
    order,
  });
});

export const getDealerOrder = asyncError(async (req, res, next) => {
  if (!req.user._id)
    return next(new ErrorHandler("유저를 찾을 수 없습니다.!!"), 404);

  const dealerOrders = await Order.find({ user: req.user._id }).populate({
    path: "user",
    select: "storeName userName team",
  });

  res.status(200).json({ success: true, dealerOrders });
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
  const order = await Order.findById(req.body.id);

  if (!order) return next(new ErrorHandler("주문를 찾을 수 없습니다.!!", 404));
  // console.log("order.user", order.user);
  // console.log("req.user._id", req.user._id);
  // if (order.user !== req.user)
  //   return next(new ErrorHandler("유저가 일치하지 않습니다.!!"), 403);

  // order delete
  await order.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "주문 삭제를 성공했습니다.!!" });
});

export const updateMyOrder = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.user.toString() !== req.user._id.toString())
    return next(new ErrorHandler("생성자가 일치하지 않습니다."), 403);

  if (!order) return next(new ErrorHandler("주문를 찾을 수 없습니다.!!", 404));

  const { deliveryDate, deliveryPlace, orderItems, totalBox, totalSum } = order;

  if (deliveryDate) orderItems.deliveryDate = deliveryDate;
  if (deliveryPlace) orderItems.deliveryPlace = deliveryPlace;
  if (orderItems) orderItems.orderItems = orderItems;
  if (totalBox) orderItems.totalBox = totalBox;
  if (totalSum) orderItems.totalSum = totalSum;

  await order.save();

  res
    .status(200)
    .json({ success: true, message: "주문 수정을 성공했습니다.!!" });
});
