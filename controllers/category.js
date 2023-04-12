import { asyncError } from "../middlewares/error.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/error.js";

export const addCategory = asyncError(async (req, res, next) => {
  // const { category } = req.body;
  // await Category.create({ category: category });
  const category = await Category.create(req.body);

  res.status(201).json({ success: true, category });
});

export const getAllCategories = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({ success: true, categories });
});

export const getCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  res.status(200).json({ success: true, category });
});

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category)
    return next(new ErrorHandler("카테고리를 찾을 수 없습니다.!!", 404));

  // Product schema category = undefined
  const products = await Product.find({ category: category._id });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.category = undefined;
    await product.save();
  }

  // category delete
  await category.deleteOne();

  res.status(200).json({
    success: true,
    message:
      "Category in Product is unDefined && Category Deleted Successfully",
  });
});
