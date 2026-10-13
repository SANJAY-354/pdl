import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { SpecialtyType, PriorityLevel } from '../../types';

export const BookingDrawer: React.FC = () => {
  const { isBookingDrawerOpen, setIsBookingDrawerOpen, doctors, addNewAppointment } = useClinic();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [patientName, setPatientName] = useState('Elena Vasquez');
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [mrn, setMrn] = useState('MRN-94021');
  const [specialty, setSpecialty] = useState<SpecialtyType>('Cardiology');
  const [urgency, setUrgency] = useState<PriorityLevel>('Routine');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Sarah Lin');
  const [date, setDate] = useState('Today');
  const [timeSlot, setTimeSlot] = useState('11:30 AM');
  const [notes, setNotes] = useState('Hypertension follow-up and ECG review');
  const [smsConsent, setSmsConsent] = useState(true);

  // Generated confirmation state
  const [confirmedToken, setConfirmedToken] = useState<string>('');

  if (!isBookingDrawerOpen) return null;

  const handleNext = async () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } else if (step === 3) {
      const apt = await addNewAppointment({
        patientName,
        patientPhone: phone,
        mrn: mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
        specialty,
        doctorName: selectedDoctor,
        date,
        timeSlot,
        urgency,
        notes,
      });
      setConfirmedToken(apt.tokenNumber);
      setStep(4);
    }
  };

  const handleClose = () => {
    setIsBookingDrawerOpen(false);
    setStep(1);
    setConfirmedToken('');
  };

  const doctorsForSpecialty = doctors.filter(
    (d) => specialty === 'General Medicine' || d.specialty === specialty
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left border-l border-[#E8E3F3]">
        {/* Top Header */}
        <div>
          <div className="p-6 border-b border-[#E8E3F3] flex items-center justify-between bg-[#F7F5FF]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#c7ee55] text-[#536b00] text-[10px] font-extrabold uppercase">
                  AI Slot Recommendation
                </span>
                <span className="text-[11px] font-bold text-[#797587]">Step 0{step} of 04</span>
              </div>
              <h3 className="font-sans text-lg font-bold text-[#1C1734]">
                {step === 4 ? 'Appointment Confirmed!' : 'Dynamic Flow Appointment Booking'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-[#797587] hover:text-[#1C1734] hover:bg-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-4 border-b border-[#E8E3F3] text-center text-xs font-bold">
            <div
              className={`py-2.5 border-b-2 ${
                step >= 1 ? 'border-[#7657ff] text-[#7657ff]' : 'border-transparent text-[#797587]'
              }`}
            >
              1. Patient
            </div>
            <div
              className={`py-2.5 border-b-2 ${
                step >= 2 ? 'border-[#7657ff] text-[#7657ff]' : 'border-transparent text-[#797587]'
              }`}
            >
              2. Specialty
            </div>
            <div
              className={`py-2.5 border-b-2 ${
                step >= 3 ? 'border-[#7657ff] text-[#7657ff]' : 'border-transparent text-[#797587]'
              }`}
            >
              3. Slot & Doc
            </div>
            <div
              className={`py-2.5 border-b-2 ${
                step === 4 ? 'border-[#c7ee55] text-[#536b00]' : 'border-transparent text-[#797587]'
              }`}
            >
              4. Pass
            </div>
          </div>

          {/* Content Steps */}
          <div className="p-6 space-y-5">
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-sm text-[#1C1734]">
                  Step 1: Patient Identification
                </h4>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium"
                    placeholder="Patient Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                      MRN / Patient ID
                    </label>
                    <input
                      type="text"
                      value={mrn}
                      onChange={(e) => setMrn(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-sm text-[#1C1734]">
                  Step 2: Specialty & Urgency Routing
                </h4>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                    Select Clinical Specialty *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Cardiology',
                      'Dermatology',
                      'Pediatrics',
                      'Orthopedics',
                      'Ophthalmology',
                      'General Medicine',
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSpecialty(s as SpecialtyType);
                          const doc = doctors.find((d) => d.specialty === s);
                          if (doc) setSelectedDoctor(doc.name);
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          specialty === s
                            ? 'bg-[#7657ff] text-white border-[#7657ff]'
                            : 'bg-[#F7F1FF] text-[#1C1734] border-[#E8E3F3] hover:bg-[#ECE4FF]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                    Triage Urgency Level *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Routine', 'Urgent', 'Acute Priority'] as PriorityLevel[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUrgency(u)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          urgency === u
                            ? u === 'Acute Priority'
                              ? 'bg-[#ca4669] text-white border-[#ca4669]'
                              : 'bg-[#7657ff] text-white border-[#7657ff]'
                            : 'bg-[#F7F1FF] text-[#1C1734] border-[#E8E3F3]'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                    Clinical Notes & Chief Complaint
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-sm text-[#1C1734]">
                  Step 3: AI Slot & Doctor Balancing
                </h4>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#F1EBFF] to-[#ECE4FF] border border-[#7657ff]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7657ff]">psychology</span>
                    <span className="text-xs font-bold text-[#1C1734]">
                      AI Predicted Wait Time for Slot:
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#c7ee55] text-[#536b00] text-xs font-extrabold">
                    ~6-8 mins (Optimized)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                    Assigned Physician
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-bold"
                  >
                    {doctorsForSpecialty.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.roomNumber}) — {d.workloadPercentage}% Load
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                      Day
                    </label>
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-bold"
                    >
                      <option value="Today">Today (Live Flow)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Friday">Friday (Standby)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                      Time Window
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-bold"
                    >
                      <option value="11:15 AM">11:15 AM (Low Wait)</option>
                      <option value="11:30 AM">11:30 AM (Recommended)</option>
                      <option value="11:45 AM">11:45 AM</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 text-xs text-[#484555] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setSmsConsent(e.target.checked)}
                    className="rounded text-[#7657ff]"
                  />
                  <span>Send dynamic SMS queue updates & token link to {phone}</span>
                </label>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#c7ee55] text-[#536b00] flex items-center justify-center font-bold shadow-lg">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <div>
                  <h4 className="font-sans text-xl font-extrabold text-[#1C1734]">
                    Booking Successfully Scheduled
                  </h4>
                  <p className="text-xs text-[#797587] mt-1">
                    Live dynamic token generated for {patientName}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F7F5FF] border-2 border-dashed border-[#7657ff]/40 text-left max-w-sm mx-auto space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E8E3F3] pb-2">
                    <span className="text-xs font-bold text-[#797587]">Digital Token:</span>
                    <span className="font-sans text-lg font-extrabold text-[#7657ff]">
                      {confirmedToken}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#797587]">Specialty:</span>
                    <span className="font-bold text-[#1C1734]">{specialty}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#797587]">Doctor:</span>
                    <span className="font-bold text-[#1C1734]">{selectedDoctor}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#797587]">Scheduled:</span>
                    <span className="font-bold text-[#1C1734]">
                      {date} at {timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E8E3F3]">
                    <span className="text-[#797587]">Live SMS Sync:</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-[#E8E3F3] bg-[#F7F5FF] flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
              className="px-4 py-2 rounded-xl border border-[#C9C4D8] text-xs font-bold text-[#484555] hover:bg-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#7657ff] text-white text-xs font-bold hover:bg-[#5d39e5] shadow-md shadow-[#7657ff]/30 flex items-center gap-2 active:scale-95"
            >
              <span>{step === 3 ? 'Confirm & Generate Token' : 'Continue'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-[#25203D] text-white text-xs font-bold hover:bg-[#312C4A] shadow-md"
            >
              Done & Return to Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
