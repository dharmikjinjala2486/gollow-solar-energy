import prisma from '../prisma/db.js';
import { sendInquiryReceipt, sendBookingReceipt, sendAdminNotification } from '../services/emailService.js';

export async function createInquiry(req, res) {
  const { 
    name, company, email, phone, emirate, propertyType, projectType, 
    roofSize, bill, contactMethod, preferredDate, preferredTime, message, type 
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required.' });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        company: company || '',
        email,
        phone,
        emirate: emirate || 'Dubai',
        propertyType: propertyType || 'Commercial',
        projectType: projectType || 'Rooftop Solar',
        roofSize: roofSize ? Number(roofSize) : 0,
        bill: bill ? Number(bill) : 0,
        contactMethod: contactMethod || 'Email',
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        message: message || '',
        type: type || 'General',
      },
    });

    const isBooking = preferredDate && preferredTime;
    const summary = `${name} (${company || 'No Company'}) - Sizing: ${roofSize || 0} m², Bill: ${bill || 0} AED, Loc: ${emirate}`;

    if (isBooking) {
      sendBookingReceipt({ email, name, date: preferredDate, time: preferredTime }).catch(console.error);
    } else {
      sendInquiryReceipt({ email, name, detailSummary: summary }).catch(console.error);
    }
    
    sendAdminNotification({ 
      type: isBooking ? 'Booking' : 'Inquiry', 
      dataSummary: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Company: ${company || 'N/A'}
        Emirate: ${emirate}
        Bill: ${bill} AED
        Roof: ${roofSize} m²
        Message: ${message || 'N/A'}
        Appointment: ${isBooking ? `${preferredDate} @ ${preferredTime}` : 'None'}
      `,
    }).catch(console.error);

    return res.status(201).json({ success: true, inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
}

export async function getAllInquiries(req, res) {
  const { status, type, search } = req.query;

  try {
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const items = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(items);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
}

export async function updateInquiryStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Contacted', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  try {
    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update status.' });
  }
}

export async function deleteInquiry(req, res) {
  const { id } = req.params;
  try {
    await prisma.inquiry.delete({ where: { id } });
    return res.json({ success: true, message: 'Inquiry record deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
}

export async function exportInquiriesCsv(req, res) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    let csvContent = 'ID,Name,Company,Email,Phone,Emirate,Property Type,Roof Size (m2),Bill (AED),Preferred Contact,Date,Time,Status,Type,Created At\n';
    
    inquiries.forEach((item) => {
      const row = [
        item.id,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${(item.company || '').replace(/"/g, '""')}"`,
        item.email,
        `"${item.phone}"`,
        item.emirate,
        item.propertyType,
        item.roofSize,
        item.bill,
        item.contactMethod,
        item.preferredDate || '',
        item.preferredTime || '',
        item.status,
        item.type,
        item.createdAt.toISOString(),
      ].join(',');
      csvContent += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=gollow_solar_inquiries.csv');
    return res.send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return res.status(500).json({ error: 'Failed to export CSV.' });
  }
}
