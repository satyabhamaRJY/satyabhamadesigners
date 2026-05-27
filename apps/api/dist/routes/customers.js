"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("@luxury/database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const customers = await database_1.prisma.customer.findMany({
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
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
