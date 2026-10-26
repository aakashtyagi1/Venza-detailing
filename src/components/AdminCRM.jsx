import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Filter, 
  Search, 
  RotateCw, 
  Trash2, 
  Eye, 
  Plus, 
  Download, 
  ShieldAlert, 
  Car, 
  ArrowLeft,
  X,
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { fetchLeads, updateLeadStatus, deleteLead, resetSeeds, fetchStats } from '../services/api';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';

const STATUS_COLORS = {
  'NEW LEAD': 'bg-red-950/80 text-[#ff1e38] border-red-800/80',
  'SCHEDULED': 'bg-amber-950/80 text-amber-400 border-amber-800/80',
  'IN PROGRESS': 'bg-blue-950/80 text-blue-400 border-blue-800/80',
  'COMPLETED': 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
  'CANCELLED': 'bg-neutral-900 text-neutral-500 border-neutral-800'
};

export default function AdminCRM({ onReturnToSite, onOpenNewBooking }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  
  // Selected lead for full inspection dossier modal
  const [inspectingLead, setInspectingLead] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  // Load leads and stats from backend API
  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetchLeads({ status: selectedStatus, search: searchQuery }),
        fetchStats()
      ]);
      setLeads(leadsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error('Error loading CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Change lead status handler
  const handleStatusChange = async (id, newStatus) => {
    playClickSound();
    try {
      await updateLeadStatus(id, newStatus);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      setActionMsg(`Lead ${id} status updated to ${newStatus}`);
      setTimeout(() => setActionMsg(''), 3000);
      // Reload stats
      const statsRes = await fetchStats();
      setStats(statsRes.data);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Delete lead handler
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete lead ${id}?`)) return;
    playClickSound();
    try {
      await deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      if (inspectingLead?.id === id) setInspectingLead(null);
      setActionMsg(`Lead ${id} removed.`);
      setTimeout(() => setActionMsg(''), 3000);
      const statsRes = await fetchStats();
      setStats(statsRes.data);
    } catch (err) {
      alert('Error deleting lead: ' + err.message);
    }
  };

  // Reset to seed leads
  const handleResetSeeds = async () => {
    if (!window.confirm('Reset database to initial VIP seed reservations?')) return;
    playClickSound();
    try {
      await resetSeeds();
      loadData();
      playSuccessChime();
      setActionMsg('Restored initial VIP customer leads.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert('Error resetting seeds');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    playClickSound();
    if (!leads.length) return;
    const headers = ["ID", "Customer Name", "Email", "Phone", "Vehicle", "Package", "Total Price", "Date", "Status"];
    const rows = leads.map(l => [
      l.id,
      `"${l.customerName}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.vehicle?.year} ${l.vehicle?.make} ${l.vehicle?.model}"`,
      `"${l.servicePackage?.name}"`,
      l.totalPrice,
      `"${l.preferredDate}"`,
      `"${l.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BRING_IT_DIRTY_LEADS_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-200 pt-20 sm:pt-24 pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-semibold tracking-widest uppercase">
                ATELIER CRM LIVE FEED
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
              COMMISSION LEADS & RESERVATIONS
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { playClickSound(); onReturnToSite(); }}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs font-mono uppercase text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO PUBLIC ATELIER</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs font-mono uppercase text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="Export all leads to CSV"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">EXPORT CSV</span>
            </button>

            <button
              onClick={handleResetSeeds}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
              title="Re-seed demo leads"
            >
              RESET SEEDS
            </button>

            <button
              onClick={() => { playClickSound(); onOpenNewBooking(); }}
              className="px-4 py-2 bg-[#ff1e38] hover:bg-[#d90429] text-white rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-glow-red"
            >
              <Plus size={14} />
              <span>NEW RESERVATION</span>
            </button>
          </div>
        </div>

        {/* Action toast message */}
        {actionMsg && (
          <div className="p-3 bg-neutral-900 border border-emerald-500/50 text-emerald-400 text-xs font-mono rounded flex items-center gap-2 animate-fadeIn">
            <CheckCircle size={14} />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* 4 KPI Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0f0f0f] border border-neutral-800/90 rounded-xl p-5 tech-border">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">TOTAL CRM LEADS</span>
              <Users size={16} className="text-[#ff1e38]" />
            </div>
            <div className="font-display font-black text-3xl text-white">
              {stats?.totalLeads ?? leads.length}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Active client reservations in database
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-neutral-800/90 rounded-xl p-5 tech-border">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">PROJECTED REVENUE</span>
              <DollarSign size={16} className="text-emerald-400" />
            </div>
            <div className="font-display font-black text-3xl text-emerald-400">
              ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '6,756'}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Total pipeline value
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-neutral-800/90 rounded-xl p-5 tech-border">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">AVERAGE TICKET</span>
              <Clock size={16} className="text-amber-400" />
            </div>
            <div className="font-display font-black text-3xl text-white">
              ${stats?.averageTicket ? stats.averageTicket.toLocaleString() : '1,689'}
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">
              Avg per exotic commission
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-neutral-800/90 rounded-xl p-5 tech-border">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">CLEANROOM BAYS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="font-display font-black text-3xl text-white">
              3 / 4
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">
              Bay 1, 2, 4 active (75% load)
            </div>
          </div>

        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['ALL', 'NEW LEAD', 'SCHEDULED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  playClickSound();
                  setSelectedStatus(st);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider uppercase transition-colors whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-[#ff1e38] text-white font-bold shadow-sm'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, car, ID..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

        </div>

        {/* Data Table */}
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/90 border-b border-neutral-800 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  <th className="py-3.5 px-4">REF ID</th>
                  <th className="py-3.5 px-4">CLIENT NAME & CONTACT</th>
                  <th className="py-3.5 px-4">VEHICLE DETAILS</th>
                  <th className="py-3.5 px-4">PACKAGE & ADD-ONS</th>
                  <th className="py-3.5 px-4">INTAKE DATE</th>
                  <th className="py-3.5 px-4">TOTAL</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-xs font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      <div className="flex items-center justify-center gap-2">
                        <RotateCw size={16} className="animate-spin text-[#ff1e38]" />
                        <span>SYNCHRONIZING ATELIER LEADS...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      No customer leads match the query.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const statusClass = STATUS_COLORS[lead.status] || 'bg-neutral-900 text-neutral-400 border-neutral-800';
                    return (
                      <tr 
                        key={lead.id}
                        className="hover:bg-neutral-900/60 transition-colors group"
                      >
                        {/* ID */}
                        <td className="py-4 px-4 font-bold text-white tracking-wider">
                          <span className="text-[#ff1e38]">#</span>{lead.id}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white group-hover:text-[#ff1e38] transition-colors">
                            {lead.customerName}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {lead.email}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {lead.phone}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="py-4 px-4">
                          <div className="text-white font-medium flex items-center gap-1.5">
                            <Car size={13} className="text-neutral-500 shrink-0" />
                            <span>{lead.vehicle?.year} {lead.vehicle?.make} {lead.vehicle?.model}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            {lead.vehicle?.paintColor}
                          </div>
                          <div className="text-[10px] text-neutral-500 italic">
                            {lead.vehicle?.condition}
                          </div>
                        </td>

                        {/* Package */}
                        <td className="py-4 px-4">
                          <div className="text-neutral-200 font-semibold">
                            {lead.servicePackage?.name}
                          </div>
                          {lead.selectedAddons?.length > 0 && (
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              +{lead.selectedAddons.length} bespoke add-on(s)
                            </div>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-neutral-300">
                          <div>{lead.preferredDate}</div>
                          <div className="text-[10px] text-neutral-500">{lead.preferredTime}</div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-bold text-white">
                          ${lead.totalPrice?.toLocaleString()}
                        </td>

                        {/* Status with inline interactive changer */}
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`text-[10px] font-mono font-bold uppercase rounded px-2.5 py-1 border cursor-pointer focus:outline-none ${statusClass}`}
                          >
                            <option value="NEW LEAD">NEW LEAD</option>
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="IN PROGRESS">IN PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                playClickSound();
                                setInspectingLead(lead);
                              }}
                              className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                              title="Inspect Customer Dossier"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-1.5 rounded bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-800 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* FULL INSPECTION DOSSIER MODAL */}
      {inspectingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setInspectingLead(null)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
          />

          <div className="relative w-full max-w-xl bg-[#0f0f0f] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 tech-border overflow-hidden">
            
            <button
              onClick={() => setInspectingLead(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#ff1e38] uppercase mb-1">
              <span>VEHICLE INTAKE DOSSIER</span>
              <span>•</span>
              <span className="font-bold">REF {inspectingLead.id}</span>
            </div>

            <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight mb-6">
              {inspectingLead.customerName}
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-neutral-500 uppercase text-[10px] mb-2 font-bold">CLIENT INFORMATION</div>
                <div className="grid grid-cols-2 gap-2 text-neutral-200">
                  <div><span className="text-neutral-500">Email:</span> {inspectingLead.email}</div>
                  <div><span className="text-neutral-500">Phone:</span> {inspectingLead.phone}</div>
                  <div><span className="text-neutral-500">Intake Date:</span> {inspectingLead.preferredDate}</div>
                  <div><span className="text-neutral-500">Time:</span> {inspectingLead.preferredTime}</div>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-neutral-500 uppercase text-[10px] mb-2 font-bold">VEHICLE & CONDITION</div>
                <div className="grid grid-cols-2 gap-2 text-neutral-200">
                  <div><span className="text-neutral-500">Car:</span> {inspectingLead.vehicle?.year} {inspectingLead.vehicle?.make} {inspectingLead.vehicle?.model}</div>
                  <div><span className="text-neutral-500">Paint:</span> {inspectingLead.vehicle?.paintColor}</div>
                  <div className="col-span-2"><span className="text-neutral-500">Initial State:</span> {inspectingLead.vehicle?.condition}</div>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-neutral-500 uppercase text-[10px] mb-2 font-bold">PACKAGE & COMMISSION VALUE</div>
                <div className="text-white font-bold text-sm mb-1">{inspectingLead.servicePackage?.name} (${inspectingLead.servicePackage?.basePrice})</div>
                {inspectingLead.selectedAddons?.length > 0 && (
                  <ul className="list-disc pl-4 text-neutral-400 space-y-1 mt-1">
                    {inspectingLead.selectedAddons.map(a => (
                      <li key={a.id}>{a.name} (+${a.price})</li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between font-bold text-sm text-[#ff1e38]">
                  <span>TOTAL QUOTE:</span>
                  <span>${inspectingLead.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {inspectingLead.specialNotes && (
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <div className="text-neutral-500 uppercase text-[10px] mb-1 font-bold">CLIENT SPECIAL NOTES</div>
                  <p className="text-neutral-300 font-sans italic text-xs">
                    "{inspectingLead.specialNotes}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500">STATUS:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_COLORS[inspectingLead.status]}`}>
                  {inspectingLead.status}
                </span>
              </div>

              <button
                onClick={() => setInspectingLead(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded text-xs font-mono uppercase"
              >
                CLOSE DOSSIER
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
