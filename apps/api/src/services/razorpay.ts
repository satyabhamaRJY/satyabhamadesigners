import Razorpay from 'razorpay';
import crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export async function createRazorpayOrder(amountInRupees: number, receiptId: string) {
  const options = {
    amount: Math.round(amountInRupees * 100), // convert to paise
    currency: 'INR',
    receipt: receiptId,
  };
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw error;
  }
}

export function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

export function verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return generatedSignature === signature;
}
