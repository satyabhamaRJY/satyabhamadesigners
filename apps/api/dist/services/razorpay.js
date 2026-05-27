"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpay = void 0;
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifySignature = verifySignature;
exports.verifyWebhookSignature = verifyWebhookSignature;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
exports.razorpay = new razorpay_1.default({
    key_id: keyId,
    key_secret: keySecret,
});
async function createRazorpayOrder(amountInRupees, receiptId) {
    const options = {
        amount: Math.round(amountInRupees * 100), // convert to paise
        currency: 'INR',
        receipt: receiptId,
    };
    try {
        const order = await exports.razorpay.orders.create(options);
        return order;
    }
    catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        throw error;
    }
}
function verifySignature(orderId, paymentId, signature) {
    const generatedSignature = crypto_1.default
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    return generatedSignature === signature;
}
function verifyWebhookSignature(payload, signature, webhookSecret) {
    const generatedSignature = crypto_1.default
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');
    return generatedSignature === signature;
}
