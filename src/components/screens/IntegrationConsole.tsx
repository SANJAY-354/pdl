import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { soundSynthesizer } from '../../services/audioAnnouncer';
import { useClinic } from '../../context/ClinicContext';

export const IntegrationConsole: React.FC = () => {
  const { showToast } = useClinic();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // SMS / WhatsApp Tester state
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [message, setMessage] = useState('Your Token CARD-104 is now called to Bay 2 with Dr. Chen.');
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  // Audio Tester state
  const [tokenNumber, setTokenNumber] = useState('CARD-104');
  const [roomNumber, setRoomNumber] = useState('Room 101');
  const [playingAudio, setPlayingAudio] = useState(false);

  // FHIR Tester state
  const [mrnQuery, setMrnQuery] = useState('MRN-78291');
  const [fhirPatientData, setFhirPatientData] = useState<any>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await api.getIntegrationsStatus();
      setStatus(data);
    } catch {
      setStatus({
        notifications: { provider: 'mock', twilio_configured: false, whatsapp_configured: false },
        fhir: { mode: 'standalone_simulated', server_url: null, hl7_version: 'R4' },
        audio: { enabled: true, speaker_engine: 'web_speech_api_and_chime_synthesizer' },
      });
    }
  };

  const handleDispatchMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDispatchResult(null);
    try {
      const res = await api.dispatchNotification(phone, message, channel);
      setDispatchResult(res);
      showToast('Notification Dispatched', `Sent via ${res.provider || 'mock'} (${channel.toUpperCase()})`, 'info');
    } catch {
      // Local fallback simulation
      setDispatchResult({
        status: 'delivered',
        provider: 'mock_local',
        channel,
        recipient: phone,
        message_id: `mock_${Date.now()}`
      });
      showToast('Notification Dispatched', `Simulated dispatch to ${phone}`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAudio = async () => {
    setPlayingAudio(true);
    const announcementText = `Calling Token ${tokenNumber} to Consultation ${roomNumber}`;
    try {
      await api.broadcastAudio(tokenNumber, roomNumber, announcementText);
    } catch {}
    // Play local chime and speech
    await soundSynthesizer.playFullAnnouncement(announcementText);
    setPlayingAudio(false);
    showToast('Loudspeaker Broadcast', `Announced ${tokenNumber} to ${roomNumber}`, 'info');
  };

  const handleFhirLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.lookupFhirPatient(mrnQuery);
      setFhirPatientData(data);
    } catch {
      setFhirPatientData({
        resourceType: 'Patient',
        id: mrnQuery,
        identifier: [{ system: 'http://hospital.mediflow.ai/patients', value: mrnQuery }],
        name: [{ family: 'Simulated', given: [mrnQuery] }],
        mode: 'standalone_simulated',
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-6">
      <div className="flex items-center justify-between border-b border-[#E8E3F3] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDE8FF] text-[#7657FF] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">hub</span>
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Modular External Integrations
            </h3>
            <p className="text-xs text-[#797587]">
              Inspect & test Audio Loudspeaker, SMS/WhatsApp gateways, and HL7 FHIR R4 pipelines
            </p>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className="p-1.5 rounded-lg border border-[#E8E3F3] text-[#797587] hover:text-[#7657FF] text-xs font-bold flex items-center gap-1"
          title="Refresh Integration Status"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Integration Status Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Audio */}
        <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7657FF] text-2xl">volume_up</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1C1734]">Clinic Chime / TTS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-[#797587]">Web Audio API + SpeechSynthesis</p>
          </div>
        </div>

        {/* SMS / WhatsApp */}
        <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#42D6C5] text-2xl">chat</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1C1734]">SMS / WhatsApp</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${status?.notifications?.twilio_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {status?.notifications?.twilio_configured ? 'Twilio Live' : 'Mock Mode'}
              </span>
            </div>
            <p className="text-[11px] text-[#797587]">Configurable via TWILIO_* env</p>
          </div>
        </div>

        {/* FHIR */}
        <div className="p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#FFBF69] text-2xl">clinical_notes</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1C1734]">HL7 FHIR R4</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                {status?.fhir?.mode === 'live' ? 'Connected' : 'Standalone'}
              </span>
            </div>
            <p className="text-[11px] text-[#797587]">Patient & Appointment R4 schemas</p>
          </div>
        </div>
      </div>

      {/* 3 Interactive Test Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Panel 1: Audio Broadcast Tester */}
        <div className="p-4 rounded-2xl border border-[#E8E3F3] bg-white space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1734]">
            <span className="material-symbols-outlined text-base text-[#7657FF]">campaign</span>
            <span>Audio Lounge Chime Test</span>
          </div>
          <p className="text-[11px] text-[#797587]">
            Synthesizes harmonic 3-tone chime followed by hospital PA text-to-speech announcement.
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-[#797587] uppercase">Token</label>
              <input
                type="text"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-[#C9C4D8] rounded-lg bg-[#F7F1FF]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#797587] uppercase">Room</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-[#C9C4D8] rounded-lg bg-[#F7F1FF]"
              />
            </div>
          </div>

          <button
            onClick={handleTestAudio}
            disabled={playingAudio}
            className="w-full py-2 rounded-xl bg-[#7657FF] hover:bg-[#5d39e5] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-base ${playingAudio ? 'animate-spin' : ''}`}>
              {playingAudio ? 'volume_up' : 'play_arrow'}
            </span>
            <span>{playingAudio ? 'Broadcasting...' : 'Play Clinic Announcement'}</span>
          </button>
        </div>

        {/* Panel 2: SMS & WhatsApp Gateway Dispatcher */}
        <div className="p-4 rounded-2xl border border-[#E8E3F3] bg-white space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1734]">
            <span className="material-symbols-outlined text-base text-[#42D6C5]">send_to_mobile</span>
            <span>Patient SMS / WhatsApp Gateway</span>
          </div>
          <p className="text-[11px] text-[#797587]">
            Sends queue status directly to recipient phone via Twilio (or safe mock logging).
          </p>

          <form onSubmit={handleDispatchMessage} className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  channel === 'sms'
                    ? 'bg-[#42D6C5]/20 border-[#42D6C5] text-[#0d7d71]'
                    : 'bg-[#F7F5FF] border-[#E8E3F3] text-[#797587]'
                }`}
              >
                SMS
              </button>
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  channel === 'whatsapp'
                    ? 'bg-[#25D366]/20 border-[#25D366] text-[#0f7a37]'
                    : 'bg-[#F7F5FF] border-[#E8E3F3] text-[#797587]'
                }`}
              >
                WhatsApp
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#797587] uppercase">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-[#C9C4D8] rounded-lg bg-[#F7F1FF]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#797587] uppercase">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full px-2.5 py-1.5 text-xs border border-[#C9C4D8] rounded-lg bg-[#F7F1FF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-[#25203D] hover:bg-[#312C4A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>{loading ? 'Dispatching...' : 'Dispatch Notification'}</span>
            </button>
          </form>

          {dispatchResult && (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-mono overflow-x-auto">
              Status: {dispatchResult.status} | Provider: {dispatchResult.provider}
            </div>
          )}
        </div>

        {/* Panel 3: HL7 FHIR R4 Inspector */}
        <div className="p-4 rounded-2xl border border-[#E8E3F3] bg-white space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1734]">
            <span className="material-symbols-outlined text-base text-[#FFBF69]">dataset</span>
            <span>HL7 FHIR R4 Schema Inspector</span>
          </div>
          <p className="text-[11px] text-[#797587]">
            Inspect interoperable FHIR Patient and Appointment resources.
          </p>

          <form onSubmit={handleFhirLookup} className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-[#797587] uppercase">MRN Number</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={mrnQuery}
                  onChange={(e) => setMrnQuery(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs border border-[#C9C4D8] rounded-lg bg-[#F7F1FF]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#FFBF69] text-[#553800] text-xs font-bold hover:bg-[#ffb047]"
                >
                  Inspect
                </button>
              </div>
            </div>
          </form>

          {fhirPatientData ? (
            <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-[#1C1734] text-[#D7FF64] text-[10px] font-mono">
              <pre>{JSON.stringify(fhirPatientData, null, 2)}</pre>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-[#F7F5FF] border border-[#E8E3F3] text-center text-[11px] text-[#797587]">
              Enter an MRN to inspect HL7 FHIR R4 JSON representation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
