import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { getRazorpayKey, processPayment, verifyPayment } from '../controller/paymentController.js';
const router=express.Router();

router.route('/payment/getkey').get(verifyUserAuth,getRazorpayKey);
router.route('/payment/process').post(verifyUserAuth,processPayment);
router.route('/payment/verify').post(verifyUserAuth,verifyPayment);

export default router;
