import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllLeads,
  addLead,
  updateLeadStatus,
  deleteLead,
  resetSeeds
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API Status & System Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'VENZA • BRING IT DIRTY Concierge & CRM Engine',
    version: '1.0.0',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node-local',
    timestamp: new Date().toISOString()
  });
});

// Admin Auth Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Demo admin credentials
  if ((username === 'admin' && password === 'admin123') || (username === 'admin' && password === 'admin')) {
    return res.json({
      success: true,
      token: 'jwt_bid_concierge_' + Date.now(),
      admin: {
        id: 'ADM-01',
        name: 'Master Concierge Admin',
        role: 'Atelier Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      }
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Invalid administrative security credentials. (Use: admin / admin123)'
  });
});

// Get Leads with optional filters
app.get('/api/leads', (req, res) => {
  try {
    let leads = getAllLeads();
    const { status, search } = req.query;

    if (status && status !== 'ALL') {
      leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l => 
        l.customerName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.vehicle?.make && l.vehicle.make.toLowerCase().includes(q)) ||
        (l.vehicle?.model && l.vehicle.model.toLowerCase().includes(q)) ||
        l.id.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving leads' });
  }
});

// Create new booking / lead
app.post('/api/leads', (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      vehicle,
      servicePackage,
      selectedAddons = [],
      totalPrice,
      preferredDate,
      preferredTime,
      specialNotes
    } = req.body;

    if (!customerName || !email || !servicePackage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerName, email, and servicePackage are required.'
      });
    }

    const createdLead = addLead({
      customerName,
      email,
      phone: phone || 'Not provided',
      vehicle: vehicle || {
        year: '2024',
        make: 'Porsche',
        model: '911 GT3',
        paintColor: 'Guards Red',
        condition: 'Track Grime'
      },
      servicePackage,
      selectedAddons,
      totalPrice: totalPrice || servicePackage.basePrice || 799,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '09:00 AM (Standard Dropoff)',
      specialNotes: specialNotes || 'Client requested premium ceramic evaluation.',
      depositPaid: false
    });

    res.status(201).json({
      success: true,
      message: "Lead successfully recorded in Atelier CRM",
      data: createdLead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: 'Error processing booking' });
  }
});

// Update lead status
app.patch('/api/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updated = updateLeadStatus(id, status, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({
      success: true,
      message: `Lead ${id} updated to ${status}`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: 'Error updating lead' });
  }
});

// Delete lead
app.delete('/api/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteLead(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({
      success: true,
      message: `Lead ${id} removed from atelier registry`
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: 'Error deleting lead' });
  }
});

// CRM Stats Overview
app.get('/api/stats', (req, res) => {
  try {
    const leads = getAllLeads();
    const totalRevenue = leads.reduce((sum, l) => sum + (Number(l.totalPrice) || 0), 0);
    const activeBookings = leads.filter(l => ['NEW LEAD', 'SCHEDULED', 'IN PROGRESS'].includes(l.status)).length;
    const completedCount = leads.filter(l => l.status === 'COMPLETED').length;
    
    const statusBreakdown = leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalLeads: leads.length,
        totalRevenue,
        activeBookings,
        completedCount,
        averageTicket: leads.length ? Math.round(totalRevenue / leads.length) : 0,
        statusBreakdown,
        cleanroomCapacity: "85% (3/4 Bays Occupied)"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating stats' });
  }
});

// Re-seed DB
app.post('/api/leads/seed', (req, res) => {
  const seeds = resetSeeds();
  res.json({ success: true, message: 'Reset to factory seed leads', data: seeds });
});

export default app;
