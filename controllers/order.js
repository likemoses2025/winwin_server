import { asyncError } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";

export const createOrder = asyncError(async (req, res, next) => {
  const { deliveryDate, deliveryPlace, orderItems, user, totalBox, totalSum } =
    req.body;

  await Order.create({
    user: req.user._id,
    deliveryDate,
    deliveryPlace,
    orderItems,
    totalBox,
    totalSum,
  });

  //   주문시 Product.Stock 차감 로직
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product);
    // product.stock = product.stock - orderItems[0].quantity;
    product.stock -= orderItems[i].quantity;
    await product.save();
  }

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
  });
});
