import { Router, Response } from 'express';
import { prisma } from '@luxury/database';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { createRazorpayOrder, verifySignature, verifyWebhookSignature } from '../services/razorpay';
import { calculateShippingRate } from '../services/shiprocket';

const router = Router();

// 1. Calculate shipping estimate (accessible by clients during checkout)
router.post('/estimate-shipping', async (req, res) => {
  const { pincode, items } = req.body; // items: { productId, quantity }[]
  if (!pincode || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Pincode and items are required' });
  }

  try {
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ success: false, error: `Product with ID ${item.productId} not found` });
      }
      totalWeight += product.weight * item.quantity;
      maxLength = Math.max(maxLength, product.length);
      maxWidth = Math.max(maxWidth, product.width);
      maxHeight += product.height * item.quantity; // stacked height
    }

    const estimate = await calculateShippingRate(
      pincode,
      totalWeight,
      maxLength || 10,
      maxWidth || 10,
      maxHeight || 5
    );

    return res.json({ success: true, data: estimate });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Create Order & Generate Razorpay ID
router.post('/create', async (req, res) => {
  const { customerId, items, shippingAddress } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
    return res.status(400).json({ success: false, error: 'Missing required order elements' });
  }

  try {
    let subtotal = 0;
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    // Validate stocks & pricing
    const validatedItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${product.name}` });
      }

      const activePrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
      subtotal += activePrice * item.quantity;
      totalWeight += product.weight * item.quantity;
      maxLength = Math.max(maxLength, product.length);
      maxWidth = Math.max(maxWidth, product.width);
      maxHeight += product.height * item.quantity;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: activePrice
      });
    }

    // Calculate shipping
    const shippingEstimate = await calculateShippingRate(
      shippingAddress.pincode,
      totalWeight,
      maxLength || 10,
      maxWidth || 10,
      maxHeight || 5
    );

    const totalAmount = subtotal + shippingEstimate.rate;
    const orderCount = await prisma.order.count();
    const orderNumber = `LUX-${10001 + orderCount}`;

    // Create Razorpay Order
    const rpOrder = await createRazorpayOrder(totalAmount, orderNumber);

    // Save Customer Profile if authenticated & not exists
    if (customerId && shippingAddress.phone) {
      await prisma.customer.upsert({
        where: { id: customerId },
        update: { phone: shippingAddress.phone, name: shippingAddress.name },
        create: { id: customerId, phone: shippingAddress.phone, name: shippingAddress.name }
      });
    }

    // Create Order in DB
    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerId || null,
        totalAmount,
        shippingAmount: shippingEstimate.rate,
        discountAmount: 0.00,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        razorpayOrderId: rpOrder.id,
        shippingAddress: shippingAddress as any,
        packageWeight: totalWeight,
        items: {
          create: validatedItems.map(vi => ({
            productId: vi.productId,
            quantity: vi.quantity,
            price: vi.price
          }))
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        order: dbOrder,
        razorpayOrder: rpOrder
      }
    });
  } catch (error: any) {
    console.error('Order Creation Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Verify Payment Signature
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Verification credentials missing' });
  }

  const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) {
    return res.status(400).json({ success: false, error: 'Invalid payment signature' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order profile not found' });
    }

    if (order.paymentStatus === 'COMPLETED') {
      return res.json({ success: true, data: order });
    }

    // Begin transactional db updates
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Deduct stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 2. Complete order payment status
      return await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentStatus: 'COMPLETED',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        include: { items: { include: { product: true } } }
      });
    });

    return res.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error('Payment Verification Transact Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Webhook Receiver for Razorpay Capture (Fallback)
router.post('/webhook', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature || !webhookSecret) {
    return res.status(400).send('Signature verify parameters missing');
  }

  const isVerified = verifyWebhookSignature(JSON.stringify(req.body), signature, webhookSecret);
  if (!isVerified) {
    return res.status(400).send('Invalid webhook signature');
  }

  const event = req.body.event;
  if (event === 'order.paid' || event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const orderId = payment.order_id;

    try {
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: orderId },
        include: { items: true }
      });

      if (order && order.paymentStatus !== 'COMPLETED') {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } }
            });
          }
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              paymentStatus: 'COMPLETED',
              razorpayPaymentId: payment.id
            }
          });
        });
      }
    } catch (dbErr) {
      console.error('Webhook database error:', dbErr);
    }
  }

  return res.status(200).send('Ok');
});

// 5. Get all orders (Admin only)
router.get('/', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Get Admin Metrics (Admin only)
router.get('/stats', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const completedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'COMPLETED'
      },
      select: {
        totalAmount: true,
        createdAt: true
      }
    });

    const totalSales = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const orderCount = await prisma.order.count();
    const customerCount = await prisma.customer.count();
    const categoryCount = await prisma.category.count();

    // Group sales over time (last 30 days)
    const salesMap: Record<string, number> = {};
    completedOrders.forEach(o => {
      const dateStr = o.createdAt.toISOString().split('T')[0];
      salesMap[dateStr] = (salesMap[dateStr] || 0) + Number(o.totalAmount);
    });

    const salesOverTime = Object.keys(salesMap)
      .sort()
      .map(date => ({ date, amount: salesMap[date] }));

    // Group items by category for popularity chart
    const items = await prisma.orderItem.findMany({
      where: {
        order: { paymentStatus: 'COMPLETED' }
      },
      include: {
        product: { include: { category: true } }
      }
    });

    const catMap: Record<string, number> = {};
    items.forEach(item => {
      const catName = item.product.category.name;
      catMap[catName] = (catMap[catName] || 0) + item.quantity;
    });

    const popularCategories = Object.keys(catMap).map(name => ({
      name,
      count: catMap[name]
    }));

    return res.json({
      success: true,
      data: {
        totalSales,
        orderCount,
        customerCount,
        categoryCount,
        salesOverTime,
        popularCategories
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Update order status and trigger Shiprocket API hook (Admin only)
router.put('/:id/status', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const updateData: any = { status };

    // Simulating connecting to Shiprocket APIs to create shipment label
    if (status === 'SHIPPED' && !order.shiprocketOrderId) {
      // Connects to Shiprocket API: POST https://apiv2.shiprocket.in/v1/external/orders/create/adhoc
      const shiprocketMockOrderId = `SR-${Math.floor(100000 + Math.random() * 900000)}`;
      const shiprocketMockShipmentId = `SR-SHIP-${Math.floor(1000000 + Math.random() * 9000000)}`;
      
      updateData.shiprocketOrderId = shiprocketMockOrderId;
      updateData.shiprocketShipmentId = shiprocketMockShipmentId;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { customer: true, items: { include: { product: true } } }
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
// 8. POS Checkout (Physical Store)
router.post('/pos', async (req, res) => {
  const { items, customerName, customerPhone, discountPercent } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing POS order items' });
  }

  if (!customerPhone) {
    return res.status(400).json({ success: false, error: 'Customer phone number is required for POS SMS billing' });
  }

  try {
    let subtotal = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, error: `Insufficient stock for ${product.name}` });
      
      const activePrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
      subtotal += activePrice * item.quantity;
      validatedItems.push({ productId: product.id, quantity: item.quantity, price: activePrice });
    }

    // Apply Owner Discount
    const validDiscount = discountPercent && discountPercent >= 0 && discountPercent <= 100 ? discountPercent : 0;
    const discountAmount = subtotal * (validDiscount / 100);
    const totalAfterDiscount = subtotal - discountAmount;
    const tax = totalAfterDiscount * 0.05; // 5% tax
    const finalTotal = totalAfterDiscount + tax;

    const orderCount = await prisma.order.count();
    const orderNumber = `POS-${10001 + orderCount}`;

    // Upsert Customer Profile
    const customer = await prisma.customer.upsert({
      where: { phone: customerPhone },
      update: { name: customerName || undefined },
      create: { phone: customerPhone, name: customerName || 'Walk-in Customer' }
    });

    // Transaction: Create Order & Deduct Stock
    const dbOrder = await prisma.$transaction(async (tx) => {
      // 1. Deduct Stock
      for (const vi of validatedItems) {
        await tx.product.update({
          where: { id: vi.productId },
          data: { stock: { decrement: vi.quantity } }
        });
      }

      // 2. Create Order
      return await tx.order.create({
        data: {
          orderNumber,
          source: 'POS',
          customerId: customer.id,
          totalAmount: finalTotal,
          shippingAmount: 0,
          discountAmount: discountAmount,
          status: 'DELIVERED', // Instant delivery for POS
          paymentStatus: 'COMPLETED',
          paymentMethod: 'POS_CASH_CARD',
          shippingAddress: { name: customerName || 'Store Customer', phone: customerPhone, addressLine1: 'In-Store Purchase' },
          packageWeight: 0,
          items: {
            create: validatedItems.map(vi => ({
              productId: vi.productId,
              quantity: vi.quantity,
              price: vi.price
            }))
          }
        },
        include: { items: { include: { product: true } } }
      });
    });

    // SMS Billing Integration Hook
    // In production, this connects to Twilio / Fast2SMS API.
    console.log(`[SMS INTEGRATION] Firing SMS to ${customerPhone}:`);
    console.log(`"Thank you ${customerName || ''}! Your bill for ₹${finalTotal} at Satyabhama Designers is paid. View e-receipt: https://admin.satyabhamadesigners.com/receipt/${orderNumber}"`);

    return res.status(201).json({ success: true, data: dbOrder });
  } catch (error: any) {
    console.error('POS Order Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
