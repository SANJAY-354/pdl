import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';

export const AnalyticsIntelligence: React.FC = () => {
  const { queue, appointments, doctors, showToast } = useClinic();
  const [timeRange, setTimeRange] = useState<'Today' | '7 Days' | '30 Days'>('Today');
  const [slaFilter, setSlaFilter] = useState<'All' | 'Compliant' | 'Breached'>('All');

  // Compute dynamic live analytics from current clinic state
  const totalEncounterCount = queue.length + appointments.length;
  const inConsultCount = queue.filter(q => q.status === 'In Consultation').length;
  const completedCount = queue.filter(q => q.status === 'Completed').length;
  
  // Wait times
  const avgWaitMinutes = queue.length > 0
    ? Math.round(queue.reduce((acc, q) => acc + (q.elapsedWaitMinutes || 0), 0) / queue.length)
    : 14;

  // SLA Breaches (>20 minutes wait)
  const breachedItems = queue.filter(q => (q.elapsedWaitMinutes || 0) > 20);
  const compliantItems = queue.filter(q => (q.elapsedWaitMinutes || 0) <= 20);
  const breachRatePct = queue.length > 0 ? ((breachedItems.length / queue.length) * 100).toFixed(1) : '2.1';

  // Display queue items filtered by SLA status
  const displayedQueueItems = queue.filter(q => {
    if (slaFilter === 'Breached') return (q.elapsedWaitMinutes || 0) > 20;
    if (slaFilter === 'Compliant') return (q.elapsedWaitMinutes || 0) <= 20;
    return true;
  });

  // Export full clinic queue and encounters to downloadable CSV
  const handleExportCSV = () => {
    const headers = [
      'Token Number',
      'Patient Name',
      'MRN',
      'Specialty',
      'Doctor Name',
      'Room/Bay',
      'Priority',
      'Status',
      'Elapsed Wait (min)',
      'Predicted Wait (min)',
      'SLA Status'
    ];

    const rows = queue.map(q => [
      q.tokenNumber,
      `"${q.patientName}"`,
      q.mrn,
      q.specialty,
      `"${q.doctorName}"`,
      q.roomNumber,
      q.priority,
      q.status,
      q.elapsedWaitMinutes,
      q.predictedWaitMinutes,
      (q.elapsedWaitMinutes || 0) > 20 ? 'BREACHED (>20m)' : 'COMPLIANT'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mediflow_telemetry_${timeRange.toLowerCase().replace(' ', '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Telemetry Exported', `Generated and downloaded CSV with ${queue.length} records.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E3F3] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#5d39e5] tracking-wider uppercase mb-1">
            <span>MEDIFLOW CORE</span>
            <span className="text-[#C9C4D8]">/</span>
            <span className="text-[#484555]">OPERATIONAL INTELLIGENCE & CLINICAL SLA</span>
          </div>
          <h1 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1C1734] tracking-tight">
            Analytics & Clinic Performance Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#484555] mt-1">
            Aggregated flow benchmarks, provider duration distributions, and AI SLA reduction telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#E8E3F3] rounded-xl p-1 shadow-xs">
            {['Today', '7 Days', '30 Days'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === t
                    ? 'bg-[#7657ff] text-white shadow-xs'
                    : 'text-[#484555] hover:bg-[#F7F1FF]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#25203D] hover:bg-[#312C4A] text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base text-[#D7FF64]">download</span>
            <span>Export CSV Telemetry</span>
          </button>
        </div>
      </div>

      {/* 4 TOP PERFORMANCE TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            Avg Patient Wait Time
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">{avgWaitMinutes} min</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              -25.8% AI Lift
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">Baseline was 18.2 min without rebalancing</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            Active Clinic Throughput
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">{totalEncounterCount}</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {inConsultCount} Active In Bay
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">{completedCount} consultations concluded today</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            SLA Breach Rate (&gt;20m)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">{breachRatePct}%</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${Number(breachRatePct) > 5 ? 'bg-red-100 text-red-900' : 'bg-emerald-100 text-emerald-800'}`}>
              {breachedItems.length} Breached
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">Target is strictly &lt; 5.0% threshold</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            Provider Coverage Status
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">
              {doctors.filter(d => d.status === 'Available').length}/{doctors.length}
            </span>
            <span className="text-[11px] font-bold text-[#536b00] bg-[#c7ee55] px-2 py-0.5 rounded-full">
              Optimal Staffing
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">Across 5 clinical department wings</p>
        </div>
      </div>

      {/* SLA COMPLIANCE AUDIT AUDIENCE BAR */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E3F3]">
          <div>
            <h3 className="font-sans font-extrabold text-base text-[#1C1734] flex items-center gap-2">
              <span>Patient Flow SLA Audit Manifest</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDE8FF] text-[#7657FF]">
                20-Minute Target SLA
              </span>
            </h3>
            <p className="text-xs text-[#797587] mt-0.5">
              Live breakdown of active patients categorized by SLA benchmark compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Compliant', 'Breached'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSlaFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  slaFilter === f
                    ? f === 'Breached'
                      ? 'bg-[#FF6F91] text-white shadow-xs'
                      : 'bg-[#7657FF] text-white shadow-xs'
                    : 'bg-[#F7F5FF] text-[#484555] hover:bg-[#ECE4FF]'
                }`}
              >
                {f} {f === 'Breached' ? `(${breachedItems.length})` : f === 'Compliant' ? `(${compliantItems.length})` : `(${queue.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E3F3] text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Patient & MRN</th>
                <th className="py-2.5 px-3">Specialty</th>
                <th className="py-2.5 px-3">Attending Doctor</th>
                <th className="py-2.5 px-3">Elapsed Wait</th>
                <th className="py-2.5 px-3">AI Pred Wait</th>
                <th className="py-2.5 px-3">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3F3]/60 font-medium">
              {displayedQueueItems.map(item => {
                const isBreached = (item.elapsedWaitMinutes || 0) > 20;
                return (
                  <tr key={item.id} className="hover:bg-[#F7F5FF] transition-colors">
                    <td className="py-3 px-3 font-extrabold text-[#7657FF]">{item.tokenNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1C1734]">{item.patientName}</div>
                      <div className="text-[10px] text-[#797587]">{item.mrn}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#5d39e5]">{item.specialty}</td>
                    <td className="py-3 px-3 font-semibold text-[#1C1734]">{item.doctorName}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${isBreached ? 'text-[#FF6F91]' : 'text-[#1C1734]'}`}>
                        {item.elapsedWaitMinutes}m
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#797587]">~{item.predictedWaitMinutes}m</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isBreached ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isBreached ? 'SLA BREACH' : 'COMPLIANT'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHARTS DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Specialty Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Specialty Patient Volume Share
            </h3>
            <span className="text-xs text-[#797587]">{totalEncounterCount} Total Clinic Visits</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Cardiology (Wing A)', pct: 32, count: '45 pts', color: 'bg-[#7657ff]' },
              { name: 'Pediatrics (Wing C)', pct: 26, count: '37 pts', color: 'bg-[#FF6F91]' },
              { name: 'Dermatology (Wing B)', pct: 18, count: '26 pts', color: 'bg-[#c7ee55]' },
              { name: 'Orthopedics (Wing D)', pct: 14, count: '20 pts', color: 'bg-[#FFBF69]' },
              { name: 'Ophthalmology (Wing E)', pct: 10, count: '14 pts', color: 'bg-emerald-500' },
            ].map((spec) => (
              <div key={spec.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C1734]">{spec.name}</span>
                  <span className="font-semibold text-[#797587]">
                    {spec.count} • <strong className="text-[#1C1734]">{spec.pct}%</strong>
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[#F1EBFF] overflow-hidden">
                  <div className={`h-full rounded-full ${spec.color}`} style={{ width: `${spec.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Consultation Duration vs SLA Target (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Consultation Duration vs Scheduled Window
            </h3>
            <span className="text-xs text-[#797587]">Minutes per Encounter</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { doc: 'Dr. Sarah Lin (Cardiology)', actual: 18, scheduled: 15, variance: '+3m' },
              { doc: 'Dr. Marcus Chen (Pediatrics)', actual: 24, scheduled: 15, variance: '+9m (Surge)' },
              { doc: 'Dr. Emily Vance (Dermatology)', actual: 12, scheduled: 15, variance: '-3m (Available)' },
              { doc: 'Dr. Rajesh Patel (Orthopedics)', actual: 17, scheduled: 15, variance: '+2m' },
              { doc: 'Dr. Sophia Rossi (Ophthalmology)', actual: 14, scheduled: 15, variance: '-1m' },
            ].map((row) => (
              <div
                key={row.doc}
                className="p-3 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#1C1734]">{row.doc}</div>
                  <div className="text-[10px] text-[#797587]">Scheduled: {row.scheduled}m slot</div>
                </div>
                <div className="text-right">
                  <div className="font-sans font-extrabold text-sm text-[#1C1734]">
                    {row.actual} min avg
                  </div>
                  <div
                    className={`text-[10px] font-bold ${
                      row.variance.includes('+9')
                        ? 'text-[#a92d51]'
                        : row.variance.includes('-')
                        ? 'text-emerald-700'
                        : 'text-[#797587]'
                    }`}
                  >
                    {row.variance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
