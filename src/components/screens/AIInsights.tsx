import React from 'react';
import { useClinic } from '../../context/ClinicContext';

export const AIInsights: React.FC = () => {
  const {
    recommendations,
    setSelectedRecommendation,
    setIsAIApprovalModalOpen,
    dismissRecommendation,
    showToast,
  } = useClinic();

  const handleReview = (rec: any) => {
    setSelectedRecommendation(rec);
    setIsAIApprovalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E3F3] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#5d39e5] tracking-wider uppercase mb-1">
            <span>MEDIFLOW CORE</span>
            <span className="text-[#C9C4D8]">/</span>
            <span className="text-[#484555]">PREDICTIVE BOTTLENECK & ML ENGINE</span>
          </div>
          <h1 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1C1734] tracking-tight flex items-center gap-3">
            <span>Predictive Bottleneck Deep-Dive & AI Recommendations</span>
            <span className="px-3 py-1 rounded-full bg-[#c7ee55] text-[#536b00] text-xs font-extrabold shadow-xs">
              Model v4.8 Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#484555] mt-1">
            Deep sequence neural analysis of clinic flow, multi-factor delay attribution, and autonomous schedule remediation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-[#5d39e5] text-xs font-extrabold border border-purple-200">
            Admin Approval Enforced
          </span>
          <button
            onClick={() => showToast('Inference Re-executed', 'Model weights synchronized against live clinic stream.', 'success')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E3F3] hover:bg-[#F7F1FF] text-xs font-bold text-[#1C1734] flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base text-[#7657ff]">refresh</span>
            <span>Re-run Inference</span>
          </button>
        </div>
      </div>

      {/* AI RECOMMENDATIONS LIST */}
      <div className="space-y-4">
        <h3 className="font-sans font-extrabold text-lg text-[#1C1734] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7657ff]">auto_awesome</span>
          <span>Pending Autonomous Schedule Rebalancing Plans</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                rec.status === 'Approved'
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white border-[#E8E3F3] shadow-card hover:shadow-lifted'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F1EBFF] text-[#5d39e5] text-[10px] font-extrabold uppercase">
                    {rec.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#c7ee55] text-[#536b00] text-[11px] font-extrabold">
                    {rec.confidenceScore}% Confidence
                  </span>
                </div>

                <h4 className="font-sans font-extrabold text-base text-[#1C1734] leading-snug">
                  {rec.title}
                </h4>

                <p className="text-xs text-[#484555] leading-relaxed">
                  {rec.description}
                </p>

                <div className="p-3 rounded-xl bg-[#F7F5FF] border border-[#E8E3F3] flex items-center justify-between text-xs">
                  <span className="text-[#797587] font-semibold">Expected Wait Reduction:</span>
                  <span className="font-sans font-extrabold text-emerald-700">
                    -{rec.impactMinutes} mins
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E3F3] flex items-center justify-between gap-2">
                {rec.status === 'Approved' ? (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Approved & Applied
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => dismissRecommendation(rec.id)}
                      className="px-3 py-1.5 rounded-xl border border-[#C9C4D8] text-xs font-bold text-[#797587] hover:text-[#a92d51]"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleReview(rec)}
                      className="px-4 py-2 rounded-xl bg-[#c7ee55] hover:bg-[#caf158] text-[#536b00] text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>Review & Approve</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTLENECK CAUSE DECOMPOSITION & HOURLY PREDICTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cause Decomposition (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Delay Attribution & Root-Cause Analysis
            </h3>
            <span className="text-xs text-[#797587]">Multi-Variable Decomposition</span>
          </div>

          <div className="space-y-4 pt-1">
            {[
              {
                cause: 'Extended Consultations (Acute Pediatric Wheezing & Biopsy Complexity)',
                percentage: 42,
                color: 'bg-[#FF6F91]',
                textColor: 'text-[#a92d51]',
              },
              {
                cause: 'Staggered Patient Late Arrivals (Transit & Registration)',
                percentage: 28,
                color: 'bg-[#7657ff]',
                textColor: 'text-[#5d39e5]',
              },
              {
                cause: 'Exam Room Turnaround & Equipment Sanitization Lag',
                percentage: 18,
                color: 'bg-[#FFBF69]',
                textColor: 'text-[#C47C10]',
              },
              {
                cause: 'Emergency Unscheduled Walk-In Disruption',
                percentage: 12,
                color: 'bg-emerald-500',
                textColor: 'text-emerald-800',
              },
            ].map((item) => (
              <div key={item.cause} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C1734] truncate pr-2">{item.cause}</span>
                  <span className={`font-sans font-extrabold ${item.textColor}`}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[#F1EBFF] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Model Architecture & Telemetry (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Model Telemetry & Prediction Accuracy
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              94.2% Precision
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
              <span className="text-[10px] font-bold uppercase text-[#797587] block">
                Algorithm Type
              </span>
              <span className="font-bold text-[#1C1734] block mt-0.5">
                LSTM + Gradient Boosted Forest
              </span>
              <span className="text-[10px] text-[#797587]">Temporal Queue Network</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
              <span className="text-[10px] font-bold uppercase text-[#797587] block">
                Mean Absolute Error
              </span>
              <span className="font-bold text-[#1C1734] block mt-0.5">± 2.4 Minutes</span>
              <span className="text-[10px] text-emerald-700 font-bold">Within 20m SLA target</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
              <span className="text-[10px] font-bold uppercase text-[#797587] block">
                Inference Latency
              </span>
              <span className="font-bold text-[#1C1734] block mt-0.5">18 ms</span>
              <span className="text-[10px] text-[#797587]">Edge Optimized</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
              <span className="text-[10px] font-bold uppercase text-[#797587] block">
                Admin Approval Policy
              </span>
              <span className="font-bold text-[#1C1734] block mt-0.5">Enforced (Human-in-Loop)</span>
              <span className="text-[10px] text-[#5d39e5] font-bold">CMO Sign-off Required</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#25203D] to-[#312C4A] text-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold block">Autonomous Queue Guard</span>
              <span className="text-[11px] text-[#c9c4d8]">
                Auto-suppresses non-compliant doctor shifts
              </span>
            </div>
            <span className="material-symbols-outlined text-[#c7ee55] text-2xl">
              security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
