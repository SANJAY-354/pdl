import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { SpecialtyType } from '../../types';

export const EmergencyTriageModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, admitEmergencyPatient } = useClinic();

  const [name, setName] = useState('');
  const [mrn, setMrn] = useState('');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [specialty, setSpecialty] = useState<SpecialtyType>('Cardiology');
  const [condition, setCondition] = useState('');

  if (!isEmergencyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    admitEmergencyPatient({
      name,
      mrn: mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      age: Number(age) || 30,
      gender,
      specialty,
      condition: condition || 'Acute triage symptoms requiring prompt intervention',
    });

    setName('');
    setCondition('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-lg overflow-hidden border-2 border-[#FF6F91] shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a92d51] to-[#ca4669] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">crisis_alert</span>
            </div>
            <div>
              <h3 className="font-sans text-lg font-extrabold tracking-tight">
                Emergency Priority Triage
              </h3>
              <p className="text-xs text-white/80">
                Admit acute walk-in patient with top queue override
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thomas Wayne"
              className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#7657ff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
                MRN (or Leave Blank)
              </label>
              <input
                type="text"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                placeholder="Auto-generate"
                className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#7657ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#7657ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
                Target Specialty *
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as SpecialtyType)}
                className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#7657ff]"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'Other')}
                className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#7657ff]"
              >
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#484555] mb-1">
              Acute Condition / Chief Complaint *
            </label>
            <textarea
              rows={3}
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Severe chest tightness, acute respiratory distress, bleeding trauma..."
              className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#7657ff]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#C9C4D8] text-[#484555] hover:bg-[#F7F1FF] text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#ca4669] hover:bg-[#a92d51] text-white text-sm font-bold shadow-md shadow-[#ca4669]/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              <span>Admit Immediately</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
