import express from 'express';
import { createProducts, deleteProduct, getAllProduct, getSingleProduct, updateProduct,getAdminProducts, createReviewforProduct, getProductReview,deleteProductReview } from '../controller/productController.js';
import { roleBasedAccess,verifyUserAuth } from '../middleware/userAuth.js';
const router =express.Router();

//Routes
router.route("/products").get(getAllProduct);
router.route("/admin/products").get(verifyUserAuth,roleBasedAccess("admin"),getAdminProducts);
router.route("/admin/product/create").post(verifyUserAuth,roleBasedAccess("admin"),createProducts);
router.route("/admin/product/:id").put(verifyUserAuth,roleBasedAccess("admin"),updateProduct).delete(verifyUserAuth,roleBasedAccess("admin"),deleteProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(verifyUserAuth,createReviewforProduct);
router.route("/reviews").get(getProductReview).delete(verifyUserAuth,deleteProductReview);
export default router;
