import cloudinary from "cloudinary";
import { asyncError } from "../middlewares/error.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri } from "../utils/features.js";

export const getAllProducts = asyncError(async (req, res, next) => {
  const { keyword, category } = req.query;

  const products = await Product.find({
    name: {
      $regex: keyword ? keyword : "",
      $options: "i",
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

export const getNewProducts = asyncError(async (req, res, next) => {
  const products = await Product.find({
    newproduct: true,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductDetails = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({ success: true, product });
});

export const createProduct = asyncError(async (req, res, next) => {
  const { no, name, code, price, newproduct, category } = req.body;

  if (req.file) {
    const file = getDataUri(req.file);
    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    const image = { public_id: myCloud.public_id, url: myCloud.secure_url };

    await Product.create({
      no,
      name,
      code,
      price,
      newproduct,
      category,
      images: [image],
    });
  } else {
    await Product.create({
      no,
      name,
      code,
      price,
      newproduct,
      category,
    });
  }

  res
    .status(200)
    .json({ success: true, message: "제품 등록을 성공했습니다.!!" });
});

export const updateProduct = asyncError(async (req, res, next) => {
  const { no, category, name, code, price } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new ErrorHandler("제품을 찾을 수 없습니다.!!", 404));

  if (no) product.no = no;
  if (category) product.category = category;
  if (name) product.name = name;
  if (code) product.code = code;
  if (price) product.price = price;

  await product.save();

  res.status(200).json({
    success: true,
    message: "제품을 성공적으로 수정했습니다.",
    product,
  });
});

export const addProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("제품을 찾을 수 없습니다.", 400));
  if (!req.file)
    return next(new ErrorHandler("제품 이미지를 찾을 수 없습니다.", 404));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = { public_id: myCloud.public_id, url: myCloud.secure_url };

  product.images.push(image);
  await product.save();

  res
    .status(200)
    .json({ success: true, message: "이미지 등록을 성공했습니다.!!" });
});

export const deleteProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("제품을 찾을수 없습니다.!!", 400));

  console.log("Query", req.query);
  const id = req.query.id;
  if (!id)
    return next(new ErrorHandler("이미지 아이디를 찾을수 없습니다.!!", 400));

  let isExist = -1;
  product.images.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  // Image doesn't exist
  if (isExist < -1)
    return next(new ErrorHandler("이미지가 존재하지 않습니다.!!", 400));

  await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

  product.images.splice(isExist, 1);

  await product.save();

  res
    .status(200)
    .json({ success: true, message: "이미지 삭제를 성공했습니다.!!" });
});

export const deleteProduct = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(product);
  if (!product) return next(new ErrorHandler("제품을 찾을수 없습니다.!!", 404));

  // cloudinary image delete
  for (let index = 0; index < product.images.length; index++) {
    await cloudinary.v2.uploader.destroy(product.images[index].public_id);
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "제품 삭제를 성공했습니다.!!",
  });
});

export const getAdminProduct = asyncError(async (req, res, next) => {
  // Search & Category query
  const products = await Product.find({});

  res.status(200).json({ success: true, products });
});

export const getOrderProducts = asyncError(async (req, res, next) => {
  // Search & Category query
  const products = await Product.find({}).select("no code name price");
  res.status(200).json({ success: true, products });
});

export const addCategory = asyncError(async (req, res, next) => {
  await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: "Category Added Successfully",
  });
});

// Category
export const getAllCategories = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorHandler("Category Not Found", 404));
  const products = await Product.find({ category: category._id });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.category = undefined;
    await product.save();
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});
