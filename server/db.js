import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Vercel serverless environment, local filesystem is read-only except /tmp
const DATA_FILE = process.env.VERCEL 
  ? path.join('/tmp', 'leads.json') 
  : path.join(__dirname, 'data', 'leads.json');

// In-memory memory fallback
let inMemoryLeads = null;

const INITIAL_SEEDS = [
  {
    id: "BID-8921",
    customerName: "Daniel Vance",
    email: "daniel.vance@vancetech.io",
    phone: "+1 (415) 890-4421",
    vehicle: {
      year: "2024",
      make: "Porsche",
      model: "911 GT3 RS (992)",
      paintColor: "Guards Red / Exposed Carbon",
      condition: "Heavy Track Grime & Brake Dust"
    },
    servicePackage: {
      id: "stage-2",
      name: "Stage-2 Paint Correction",
      duration: "2 Days Turnaround",
      basePrice: 799
    },
    selectedAddons: [
      { id: "ceramic-wheels", name: "Wheel Off & Caliper Ceramic", price: 250 },
      { id: "interior-alcantara", name: "Alcantara Hydrophobic Shield", price: 180 }
    ],
    totalPrice: 1229,
    preferredDate: "2026-11-04",
    preferredTime: "08:30 AM (Morning Dropoff)",
    specialNotes: "Car just finished 3 track days at Laguna Seca. Heavy rubber marbles on rear fenders.",
    status: "SCHEDULED",
    createdAt: "2026-10-25T14:32:00.000Z",
    depositPaid: true
  },
  {
    id: "BID-7734",
    customerName: "Elena Rostova",
    email: "e.rostova@monacocapital.com",
    phone: "+1 (305) 552-9118",
    vehicle: {
      year: "2023",
      make: "Ferrari",
      model: "F8 Tributo",
      paintColor: "Rosso Corsa Metallic",
      condition: "Dealer Swirl Marks & Light Holograms"
    },
    servicePackage: {
      id: "ceramic-10h",
      name: "10H Ceramic Armor Shield",
      duration: "3-4 Days Turnaround",
      basePrice: 1499
    },
    selectedAddons: [
      { id: "glass-coating", name: "Full Glass Hydrophobic Treatment", price: 150 },
      { id: "engine-bay", name: "V8 Engine Bay Cryo-Clean & Detail", price: 290 }
    ],
    totalPrice: 1939,
    preferredDate: "2026-11-08",
    preferredTime: "09:00 AM (Flatbed Transport)",
    specialNotes: "Requires enclosed trailer pickup from Sunny Isles estate. Flawless mirror finish required for Concours.",
    status: "NEW LEAD",
    createdAt: "2026-10-26T08:15:00.000Z",
    depositPaid: false
  },
  {
    id: "BID-6512",
    customerName: "Marcus Sterling",
    email: "m.sterling@velocityholdings.co",
    phone: "+1 (949) 302-8877",
    vehicle: {
      year: "2022",
      make: "McLaren",
      model: "720S Spider",
      paintColor: "Papaya Spark Orange",
      condition: "Swirl Marks & Acid Rain Etching"
    },
    servicePackage: {
      id: "ceramic-10h",
      name: "10H Ceramic Armor Shield",
      duration: "3-4 Days Turnaround",
      basePrice: 1499
    },
    selectedAddons: [
      { id: "ppf-front", name: "Track-Pack Self-Healing PPF", price: 1850 }
    ],
    totalPrice: 3349,
    preferredDate: "2026-10-27",
    preferredTime: "10:00 AM",
    specialNotes: "Currently in curing booth bay 2. Final infrared bake scheduled.",
    status: "IN PROGRESS",
    createdAt: "2026-10-24T11:20:00.000Z",
    depositPaid: true
  },
  {
    id: "BID-5420",
    customerName: "Alexander Hayes",
    email: "ahayes@apexmotors.de",
    phone: "+1 (212) 441-9023",
    vehicle: {
      year: "2024",
      make: "BMW",
      model: "M4 CSL",
      paintColor: "Frozen Brooklyn Grey (Matte)",
      condition: "General Road Contamination"
    },
    servicePackage: {
      id: "signature-wash",
      name: "Signature Decon Wash",
      duration: "1 Day Turnaround",
      basePrice: 249
    },
    selectedAddons: [],
    totalPrice: 249,
    preferredDate: "2026-10-23",
    preferredTime: "01:30 PM",
    specialNotes: "Matte-specific pH neutral wash and chemical decontamination completed.",
    status: "COMPLETED",
    createdAt: "2026-10-22T16:45:00.000Z",
    depositPaid: true
  }
];

function ensureDb() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SEEDS, null, 2), 'utf-8');
    }
  } catch (err) {
    if (!inMemoryLeads) inMemoryLeads = [...INITIAL_SEEDS];
  }
}

export function getAllLeads() {
  ensureDb();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryLeads = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Filesystem read warning, falling back to memory:', err.message);
  }
  return inMemoryLeads || INITIAL_SEEDS;
}

export function saveLeads(leads) {
  inMemoryLeads = leads;
  try {
    ensureDb();
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write warning (persisted in memory):', err.message);
  }
}

export function addLead(leadData) {
  const leads = getAllLeads();
  const id = `BID-${Math.floor(1000 + Math.random() * 9000)}`;
  const newLead = {
    id,
    ...leadData,
    createdAt: new Date().toISOString(),
    status: leadData.status || "NEW LEAD",
  };
  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
}

export function updateLeadStatus(id, status, notes) {
  const leads = getAllLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  leads[index].status = status;
  if (notes !== undefined) {
    leads[index].specialNotes = notes;
  }
  leads[index].updatedAt = new Date().toISOString();
  saveLeads(leads);
  return leads[index];
}

export function deleteLead(id) {
  const leads = getAllLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;
  saveLeads(filtered);
  return true;
}

export function resetSeeds() {
  saveLeads(INITIAL_SEEDS);
  return INITIAL_SEEDS;
}
