import axios from 'axios';

let shiprocketToken: string | null = null;
let tokenExpiresAt: number | null = null;

const email = process.env.SHIPROCKET_EMAIL || '';
const password = process.env.SHIPROCKET_PASSWORD || '';
const WAREHOUSE_PINCODE = '560001'; // Luxury Saree central warehouse in Bengaluru

async function getShiprocketToken(): Promise<string> {
  const now = Date.now();
  if (shiprocketToken && tokenExpiresAt && now < tokenExpiresAt) {
    return shiprocketToken;
  }

  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password,
    });
    shiprocketToken = response.data.token;
    // Shiprocket tokens typically expire in 10 days, cache for 9 days
    tokenExpiresAt = now + 9 * 24 * 60 * 60 * 1000;
    return shiprocketToken!;
  } catch (error) {
    console.warn('Shiprocket Auth Failed. Falling back to local calculator.');
    throw new Error('Shiprocket auth failed');
  }
}

export interface ShippingRateEstimate {
  rate: number;
  courierName: string;
  estimatedDeliveryDays: number;
}

export async function calculateShippingRate(
  deliveryPincode: string,
  weightInGrams: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number
): Promise<ShippingRateEstimate> {
  const weightKg = weightInGrams / 1000;

  try {
    const token = await getShiprocketToken();
    const response = await axios.get('https://apiv2.shiprocket.in/v1/external/courier/serviceability/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pickup_postcode: WAREHOUSE_PINCODE,
        delivery_postcode: deliveryPincode,
        weight: weightKg,
        cod: 0,
        length: lengthCm,
        width: widthCm,
        height: heightCm,
      },
    });

    const couriers = response.data?.data?.available_courier_companies;
    if (couriers && couriers.length > 0) {
      const recommended = couriers.reduce((prev: any, curr: any) => {
        return parseFloat(curr.rate) < parseFloat(prev.rate) ? curr : prev;
      });

      return {
        rate: parseFloat(recommended.rate),
        courierName: recommended.courier_name,
        estimatedDeliveryDays: parseInt(recommended.etd_hours || '72', 10) / 24,
      };
    }
  } catch (error) {
    // Catch-all to execute local estimation on failure
  }

  // Fallback Logic: Realistic Indian Shipping Rate Calculator
  let baseRate = 80;
  let estimatedDeliveryDays = 4;

  if (deliveryPincode === WAREHOUSE_PINCODE) {
    baseRate = 40;
    estimatedDeliveryDays = 1;
  } else if (deliveryPincode.startsWith('560')) {
    baseRate = 60;
    estimatedDeliveryDays = 1;
  } else if (deliveryPincode.startsWith('5')) {
    baseRate = 90;
    estimatedDeliveryDays = 2;
  } else if (deliveryPincode.startsWith('4') || deliveryPincode.startsWith('3')) {
    baseRate = 120;
    estimatedDeliveryDays = 3;
  } else if (deliveryPincode.startsWith('1') || deliveryPincode.startsWith('2')) {
    baseRate = 140;
    estimatedDeliveryDays = 4;
  } else if (deliveryPincode.startsWith('7') || deliveryPincode.startsWith('8')) {
    baseRate = 160;
    estimatedDeliveryDays = 5;
  } else {
    baseRate = 220;
    estimatedDeliveryDays = 6;
  }

  const extraWeightKg = Math.max(0, weightKg - 1.5);
  const weightSurcharge = Math.ceil(extraWeightKg) * 50;

  return {
    rate: baseRate + weightSurcharge,
    courierName: 'Delhivery Luxury Express (Simulated)',
    estimatedDeliveryDays,
  };
}
