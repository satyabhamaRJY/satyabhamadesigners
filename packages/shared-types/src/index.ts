export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RazorpayOrderPayload {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ShiprocketEstimatePayload {
  delivery_postcode: string;
  weight: number; // in kg
  cod: 0 | 1;
}

export interface ShiprocketEstimateResponse {
  shipping_cost: number;
  delivery_date: string;
  courier_name: string;
}

export interface CheckoutPayload {
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface CreateSareePayload {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  images: string[];
  weight: number; // in grams
  length: number;
  width: number;
  height: number;
  sku: string;
  stock: number;
}

export interface AdminStats {
  totalSales: number;
  orderCount: number;
  customerCount: number;
  categoryCount: number;
  salesOverTime: { date: string; amount: number }[];
  popularCategories: { name: string; count: number }[];
}
