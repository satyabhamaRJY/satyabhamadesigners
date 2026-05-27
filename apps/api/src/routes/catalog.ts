import { Router, Response } from 'express';
import { prisma } from '@luxury/database';
import { requireAdmin } from '../middleware/auth';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// ==========================================
// CATEGORIES ROUTES
// ==========================================

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return res.json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get a category by ID or slug
router.get('/categories/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: slugOrId },
          { slug: slugOrId }
        ]
      },
      include: { products: true }
    });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    return res.json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Create a category (Admin only)
router.post('/categories', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, description, image } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ success: false, error: 'Name and slug are required' });
  }

  try {
    const category = await prisma.category.create({
      data: { name, slug, description, image }
    });
    return res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Update a category (Admin only)
router.put('/categories/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, slug, description, image } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, image }
    });
    return res.json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a category (Admin only)
router.delete('/categories/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id } });
    return res.json({ success: true, data: { message: 'Category deleted successfully' } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});


// ==========================================
// PRODUCTS (SAREES) ROUTES
// ==========================================

// Get all products (with optional filter by category slug/id)
router.get('/products', async (req, res) => {
  const { categoryId, categorySlug } = req.query;
  try {
    const whereClause: any = {};
    if (categoryId) {
      whereClause.categoryId = categoryId as string;
    } else if (categorySlug) {
      whereClause.category = { slug: categorySlug as string };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single product by barcode (POS Scanner)
router.get('/products/barcode/:barcode', async (req, res) => {
  const { barcode } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { barcode },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single product by ID or slug
router.get('/products/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: slugOrId },
          { slug: slugOrId }
        ]
      },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Create a product (Admin only)
router.post('/products', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const {
    name, slug, description, price, discountPrice,
    categoryId, images, weight, length, width, height, sku, barcode, stock
  } = req.body;

  if (!name || !slug || !description || !price || !categoryId || !sku || weight === undefined) {
    return res.status(400).json({ success: false, error: 'Missing required saree attributes' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discountPrice,
        categoryId,
        images,
        weight: parseFloat(weight),
        length: parseFloat(length || 0),
        width: parseFloat(width || 0),
        height: parseFloat(height || 0),
        sku,
        barcode: barcode || null,
        stock: parseInt(stock || 0)
      }
    });
    return res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Update a product (Admin only)
router.put('/products/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    name, slug, description, price, discountPrice,
    categoryId, images, weight, length, width, height, sku, barcode, stock
  } = req.body;

  try {
    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = price;
    if (discountPrice !== undefined) dataToUpdate.discountPrice = discountPrice;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (images !== undefined) dataToUpdate.images = images;
    if (weight !== undefined) dataToUpdate.weight = parseFloat(weight);
    if (length !== undefined) dataToUpdate.length = parseFloat(length);
    if (width !== undefined) dataToUpdate.width = parseFloat(width);
    if (height !== undefined) dataToUpdate.height = parseFloat(height);
    if (sku !== undefined) dataToUpdate.sku = sku;
    if (barcode !== undefined) dataToUpdate.barcode = barcode || null;
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock);

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a product (Admin only)
router.delete('/products/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, data: { message: 'Product deleted successfully' } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
