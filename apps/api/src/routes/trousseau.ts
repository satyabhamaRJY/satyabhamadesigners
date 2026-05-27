import { Router } from 'express';
import { prisma } from '@luxury/database';
import crypto from 'crypto';

const router = Router();

// Create a new Trousseau Board
router.post('/create', async (req, res) => {
  try {
    const { title, description, brideId } = req.body;

    if (!title || !brideId) {
      return res.status(400).json({ success: false, message: 'Missing title or brideId' });
    }

    // Generate a secure, unique shareable slug
    const randomHex = crypto.randomBytes(4).toString('hex');
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomHex}`;

    const board = await prisma.trousseauBoard.create({
      data: {
        title,
        description,
        brideId,
        slug
      }
    });

    return res.json({ success: true, data: board });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get a board by slug (Public view for family)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const board = await prisma.trousseauBoard.findUnique({
      where: { slug },
      include: {
        bride: {
          select: { name: true }
        },
        items: {
          include: {
            product: true,
            comments: {
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { upvotes: 'desc' }
        }
      }
    });

    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }

    return res.json({ success: true, data: board });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Add a product to a board
router.post('/items', async (req, res) => {
  try {
    const { boardId, productId } = req.body;

    const item = await prisma.trousseauItem.create({
      data: { boardId, productId }
    });

    return res.json({ success: true, data: item });
  } catch (error: any) {
    // Handle Prisma unique constraint failure if product already exists on board
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Product already in this Trousseau' });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Upvote an item (Anonymous / Family)
router.post('/:slug/upvote', async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await prisma.trousseauItem.update({
      where: { id: itemId },
      data: {
        upvotes: { increment: 1 }
      }
    });

    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Add a comment to an item (Family)
router.post('/:slug/comment', async (req, res) => {
  try {
    const { itemId, author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({ success: false, message: 'Author and text are required' });
    }

    const comment = await prisma.trousseauComment.create({
      data: {
        itemId,
        author,
        text
      }
    });

    return res.json({ success: true, data: comment });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
