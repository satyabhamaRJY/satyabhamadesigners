import { Router } from 'express';
import { prisma } from '@luxury/database';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAdmin, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            paymentStatus: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCustomers = customers.map(customer => {
      const completedOrders = customer.orders.filter(o => o.paymentStatus === 'COMPLETED');
      const totalSpent = completedOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

      return {
        id: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
        totalSpent,
        orderCount: customer.orders.length,
        orders: customer.orders
      };
    });

    return res.json({ success: true, data: formattedCustomers });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
