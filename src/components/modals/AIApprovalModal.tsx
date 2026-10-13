import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';

export const AIApprovalModal: React.FC = () => {
  const {
    isAIApprovalModalOpen,
    setIsAIApprovalModalOpen,
    selectedRecommendation,
    approveRecommendation,
    dismissRecommendation,
    currentUser,
  } = useClinic();

  const isAdmin = currentUser?.role === 'admin';

  const [adminNotes, setAdminNotes] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isAIApprovalModalOpen || !selectedRecommendation) return null;

  const handleApprove = () => {
    setIsApplying(true);
    setTimeout(() => {
      approveRecommendation(selectedRecommendation.id);
      setIsApplying(false);
    }, 600);
  };

  const handleDismiss = () => {
    dismissRecommendation(selectedRecommendation.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-xl overflow-hidden border-2 border-[#c7ee55] shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#25203D] to-[#312C4A] p-6 text-white border-b border-[#c7ee55]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#c7ee55] text-[#536b00] flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-[#c7ee55] text-[#536b00] text-[10px] font-extrabold uppercase tracking-wider">
                  Admin Approval Required
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#c9beff] text-[10px] font-bold">
                  Simulated AI Prediction
                </span>
              </div>
              <h3 className="font-sans text-base font-extrabold tracking-tight text-white">
                Review AI Autonomous Queue Recommendation
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsAIApprovalModalOpen(false)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Card Description */}
          <div className="p-4 rounded-2xl bg-[#F7F1FF] border border-[#ECE4FF]">
            <h4 className="font-sans font-bold text-sm text-[#1C1734] mb-1">
              {selectedRecommendation.title}
            </h4>
            <p className="text-xs text-[#484555] leading-relaxed">
              {selectedRecommendation.description}
            </p>
          </div>

          {/* Metric Comparison */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-[#E8E3F3] text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase text-[#797587]">
                Wait Reduction
              </span>
              <span className="text-lg font-extrabold text-[#506600]">
                -{selectedRecommendation.impactMinutes} min
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E8E3F3] text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase text-[#797587]">
                Model Confidence
              </span>
              <span className="text-lg font-extrabold text-[#7657ff]">
                {selectedRecommendation.confidenceScore}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E8E3F3] text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase text-[#797587]">
                Category
              </span>
              <span className="text-xs font-bold text-[#1C1734] truncate mt-1">
                {selectedRecommendation.category}
              </span>
            </div>
          </div>

          {/* Action Details */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-xl mt-0.5">
              task_alt
            </span>
            <div>
              <span className="text-xs font-bold text-emerald-900 block">
                Proposed Operational Action:
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                {selectedRecommendation.suggestedAction}
              </p>
            </div>
          </div>

          {/* Admin Override Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
              Administrator Audit Log Note (Optional)
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Approved by Dr. Sarah Lin (CMO) during morning peak"
              className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-medium focus:outline-none focus:border-[#7657ff]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3 border-t border-[#E8E3F3]">
            {/* Non-admin lock notice */}
            {!isAdmin && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">lock</span>
                <p className="text-xs text-amber-800 font-medium">
                  <span className="font-bold">Admin role required</span> to approve AI recommendations.
                  Switch to <span className="font-bold">CMO / Admin</span> role using the role switcher in the top bar.
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl border border-[#C9C4D8] text-[#797587] hover:text-[#ba1a1a] hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Dismiss Recommendation
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAIApprovalModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#C9C4D8] text-[#484555] hover:bg-[#F7F1FF] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isApplying || !isAdmin}
                  title={!isAdmin ? 'Admin role required to approve AI recommendations' : undefined}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-[#c7ee55] hover:bg-[#caf158] text-[#536b00] shadow-[#c7ee55]/40'
                      : 'bg-[#E8E3F3] text-[#A09AB8] cursor-not-allowed shadow-none'
                  }`}
                >
                  {isApplying ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">
                        sync
                      </span>
                      <span>Enacting Rebalancing...</span>
                    </>
                  ) : !isAdmin ? (
                    <>
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span>Admin Only</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">
                        verified
                      </span>
                      <span>Approve & Apply Optimization</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
