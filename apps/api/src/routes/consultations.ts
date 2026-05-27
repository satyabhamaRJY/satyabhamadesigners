import { Router } from 'express';
import { prisma } from '@luxury/database';

const router = Router();

// Book a White-Glove Consultation
router.post('/book', async (req, res) => {
  try {
    const { customerId, scheduledAt, notes } = req.body;

    if (!customerId || !scheduledAt) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 1. In a production environment, we would integrate with Cal.com here via their API
    const simulatedEventId = `cal_event_${Math.floor(Math.random() * 1000000)}`;

    // 2. Integrate with Daily.co to generate a unique WebRTC video room
    // Simulated Daily.co Response:
    const meetingLink = `https://satyabhama.daily.co/vip-room-${Math.floor(Math.random() * 9000) + 1000}`;

    // 3. Save to database
    const consultation = await prisma.stylingConsultation.create({
      data: {
        customerId,
        scheduledAt: new Date(scheduledAt),
        meetingLink,
        eventId: simulatedEventId,
        notes,
        status: 'CONFIRMED' // Auto-confirming for luxury instant booking
      }
    });

    return res.json({
      success: true,
      message: 'Consultation confirmed',
      data: consultation
    });
  } catch (error: any) {
    console.error('Booking failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get customer's upcoming consultations
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const consultations = await prisma.stylingConsultation.findMany({
      where: { customerId },
      orderBy: { scheduledAt: 'asc' }
    });

    return res.json({ success: true, data: consultations });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
