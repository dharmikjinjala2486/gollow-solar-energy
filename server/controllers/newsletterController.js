import prisma from '../prisma/db.js';
import { sendNewsletterWelcome } from '../services/emailService.js';

export async function subscribe(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.active) {
        return res.status(409).json({ error: 'This email is already subscribed.' });
      } else {
        await prisma.subscriber.update({
          where: { email },
          data: { active: true },
        });
        sendNewsletterWelcome({ email }).catch(console.error);
        return res.json({ success: true, message: 'Subscription reactivated!' });
      }
    }

    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    sendNewsletterWelcome({ email }).catch(console.error);

    return res.status(201).json({ success: true, subscriber });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
}

export async function getAllSubscribers(req, res) {
  try {
    const list = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve subscriber list.' });
  }
}

export async function exportSubscribersCsv(req, res) {
  try {
    const list = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });

    let csvContent = 'Email,Active,Subscribed At\n';
    list.forEach((item) => {
      csvContent += `${item.email},${item.active ? 'Yes' : 'No'},${item.subscribedAt.toISOString()}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=gollow_subscribers.csv');
    return res.send(csvContent);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to export subscriber CSV.' });
  }
}
