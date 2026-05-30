import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from '@luxury/database';

// Load environment variables
dotenv.config();

import catalogRoutes from './routes/catalog';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import aiRoutes from './routes/ai';
import consultationRoutes from './routes/consultations';
import trousseauRoutes from './routes/trousseau';
import uploadRoutes from './routes/upload';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // For development, allow all storefront requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-bypass']
}));

// Apply JSON parser (bypass signature webhook raw body checks if needed, but for simulator we use standard JSON)
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routers
app.use('/api/catalog', catalogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/trousseau', trousseauRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health check and db connectivity verification
app.get('/api/health', async (req, res) => {
  try {
    // Basic ping to verify database connection
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ success: true, status: 'healthy', database: 'connected' });
  } catch (error: any) {
    return res.status(500).json({ success: false, status: 'unhealthy', error: error.message });
  }
});

// Auto-seed database if empty
async function seedDatabaseIfEmpty() {
  try {
    const categoryCount = await prisma.category.count();
    if (categoryCount > 0) {
      console.log('Database already has items. Skipping auto-seed.');
      return;
    }

    console.log('Seeding initial luxury saree categories and products...');
    
    // Create Categories
    const kanjeevaram = await prisma.category.create({
      data: {
        name: 'Kanjeevaram Silk',
        slug: 'kanjeevaram-silk',
        description: 'Handwoven in Kanchipuram, Tamil Nadu, characterized by gold-dipped silver zari and rich, dense silk borders.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
      }
    });

    const banarasi = await prisma.category.create({
      data: {
        name: 'Banarasi Brocade',
        slug: 'banarasi-brocade',
        description: 'Finest handwoven silk with intricate gold and silver brocade embroidery from Varanasi, Uttar Pradesh.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
      }
    });

    const chanderi = await prisma.category.create({
      data: {
        name: 'Chanderi Weaver',
        slug: 'chanderi-weaver',
        description: 'A traditional ethnic fabric characterized by its lightweight, sheer texture and fine luxurious feel.',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80'
      }
    });

    // Create Products
    await prisma.product.create({
      data: {
        name: 'Vaikuntha Gold Brocade Kanjeevaram',
        slug: 'vaikuntha-gold-kanjeevaram',
        description: 'Exquisite crimson red Kanjeevaram saree featuring a solid gold zari border, handwoven by master artisans over 180 hours. Adorned with traditional peacock and coin motifs representing eternal prosperity.',
        price: 185000.00,
        discountPrice: 165000.00,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
        ],
        weight: 1200,
        length: 550,
        width: 110,
        height: 5,
        sku: 'LUX-KANJ-RED-001',
        stock: 4,
        categoryId: kanjeevaram.id
      }
    });

    await prisma.product.create({
      data: {
        name: 'Emerald Royal Banarasi Saree',
        slug: 'emerald-royal-banarasi',
        description: 'Deep emerald green banarasi saree crafted from premium Katan silk. Embroidered with real silver-dipped zari in a classic Shikargah hunting scene pattern across the body, finished with a heavy gold brocade pallu.',
        price: 240000.00,
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
        ],
        weight: 1400,
        length: 550,
        width: 115,
        height: 6,
        sku: 'LUX-BANA-GRN-002',
        stock: 2,
        categoryId: banarasi.id
      }
    });

    await prisma.product.create({
      data: {
        name: 'Midnight Sheer Chanderi Saree',
        slug: 'midnight-sheer-chanderi',
        description: 'Lightweight, semi-sheer midnight black Chanderi silk saree with hand-painted gold leaf borders. Perfectly balances modern minimal aesthetic with traditional weaver legacy.',
        price: 85000.00,
        discountPrice: 78000.00,
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
        ],
        weight: 700,
        length: 550,
        width: 110,
        height: 4,
        sku: 'LUX-CHAN-BLK-003',
        stock: 7,
        categoryId: chanderi.id
      }
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
}

// Start Server
app.listen(PORT, async () => {
  console.log(`Luxury Saree Backend API running on port ${PORT}`);
  // Try to seed database
  await seedDatabaseIfEmpty();
});
