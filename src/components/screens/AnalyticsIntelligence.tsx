import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';

export const AnalyticsIntelligence: React.FC = () => {
  const { showToast } = useClinic();
  const [timeRange, setTimeRange] = useState<'Today' | '7 Days' | '30 Days'>('Today');

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
            onClick={() => showToast('Analytics Exported', 'Full clinic telemetry report exported as CSV.', 'success')}
            className="px-4 py-2 rounded-xl bg-white border border-[#E8E3F3] hover:bg-[#F7F1FF] text-[#1C1734] text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Report</span>
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
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">13.5 min</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              -25.8% AI Lift
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">Baseline was 18.2 min without rebalancing</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            Daily Throughput Volume
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">142</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              +9.2% Capacity
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">12 additional patients treated vs SLA baseline</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            SLA Breach Rate (&gt;20m)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">2.1%</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Target &lt; 5%
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">Down from historical 8.4% breach rate</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E3F3] shadow-card">
          <span className="text-[11px] font-extrabold uppercase text-[#797587]">
            No-Show Auto-Recovery
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-sans text-3xl font-extrabold text-[#1C1734]">94.2%</span>
            <span className="text-[11px] font-bold text-[#536b00] bg-[#c7ee55] px-2 py-0.5 rounded-full">
              High Accuracy
            </span>
          </div>
          <p className="text-xs text-[#797587] mt-1">Standby buffer saved $3,400 in lost doctor hours</p>
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
            <span className="text-xs text-[#797587]">142 Total Visits</span>
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
