# MediFlow AI — Specialty-Aware AI-Driven Clinic Queue & Flow Optimizer

MediFlow AI is an editorial, high-performance healthcare management web application designed to eliminate clinical fatigue and streamline high-throughput patient flow. It integrates multi-department capacity orchestration, dynamic exam bay allocation, real-time token calling, and machine learning wait-time forecasting with enforced administrator approval for AI recommendations.

---

## 🎨 Google Stitch Screen Reference Mapping

All 8 screens from Google Stitch Project `10848362290459231529` have been implemented as cohesive, interactive views within a single React application:

| # | Stitch Screen Reference | Screen Name | Route | Key Functionality |
|---|---|---|---|---|
| **Primary** | `screens/9e92e8de41ef4d20adf9167c42ae8956` | **Operations Dashboard & Queue Optimization** | `/` or `/operations` | 5 KPI metrics, Hero AI Rebalance card, Live token manifest, Exam room status, Hourly LSTM trajectory. |
| **1** | `screens/55fdad02ba9a4554b8ba37726ce26f61` | **Live Queue & Room Assignment Hub** | `/live-queue` | Token calling, status pills, audio chime broadcast modal, hold queue toggle, exam room allocation grid. |
| **2** | `screens/222899ef250741b29eacd3d5f0bd2e6c` | **Patient Appointment Booking & Confirmation** | `/appointments` | 4-Stage clinical flow (Patient ID -> Specialty -> AI Doctor Match -> Pass), past bookings manifest, SMS alerts. |
| **3** | `screens/bbdf24e0e17c4ffd9236142f7f3633b9` | **Specialty Management & Bay Allocation** | `/specialties` | 5 Clinical Wings (Cardiology, Dermatology, Pediatrics, Orthopedics, Ophthalmology), 24 bay statuses, cross-cover triage. |
| **4** | `screens/fec6c37d9b88446fb7a74f74330a6715` | **Doctors & Staff Schedule & Workload Allocation** | `/staff-schedule` | Practitioner availability, shift hours, workload intensity gauges, dynamic doctor status toggling. |
| **5** | `screens/0711728926fd423c88832223d641ee7d` | **Predictive Bottleneck Deep-Dive (AI Insights)** | `/ai-insights` | Delay attribution decomposition, confidence scores, 3 pending AI rebalance actions with Admin approval modal. |
| **6** | `screens/9574c61e5d624aceac19ec53fb93f24e` | **Analytics & Operational Intelligence** | `/analytics` | Wait-time benchmarks, daily throughput volume, SLA breach rates, consultation duration variance. |
| **7** | `screens/d6bed7d70daf464eb372387686f49b88` | **Clinic Settings & Alert Notification Center** | `/settings` | Real-time notification feed, SLA threshold slider, Human-in-the-loop AI enforcement, notification templates. |

---

## 🚀 Running the Application

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Installation & Launch
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start Vite development server
npm run dev

# 3. Open browser at:
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧩 Architectural Highlights & Design System

- **Color Palette (Neon Bloom)**:
  - **Electric Orchid (`#7657FF`)**: Brand anchor & active interaction
  - **Acid Lime (`#D7FF64` / `#c7ee55`)**: AI intelligence accent & confidence metrics
  - **Pop Coral (`#FF6F91` / `#ca4669`)**: Urgency signals, SLA breaches & emergency triage
  - **Deep Plum (`#25203D`)**: Sidebar navigation foundation & contrast anchor
  - **Mint Pulse (`#42D6C5`)**: Vitality, live sync & on-time statuses
  - **Solar Amber (`#FFBF69`)**: Triage caution & hold states
  - **Cloud Lilac (`#F7F5FF`)**: Atmospheric glare-free canvas
  - **Pure White (`#FFFFFF`)**: Metric & container cards
- **Typography**: Plus Jakarta Sans (Headings & Display), Inter (Interface & Tabular clinical data).
- **Responsive Layout**: Desktop (fixed 280px sidebar), Tablet, and Mobile (drawer + bottom quick navigation bar).
- **State Management**: Centralized `ClinicContext` providing live reactive updates between appointments, queue status, room assignments, and notifications.

---

## 🔌 Features Planned for Backend & Machine Learning Integration

While the frontend prototype provides interactive simulated AI predictions, the following features will integrate with production backend services:

1. **Real-Time WebSocket / SSE Feed**: Replace client simulation with server-sent events for multi-clinic real-time queue synchronization.
2. **Live EHR / FHIR Integration**: Connect patient identification and medical record numbers (MRN) directly with Epic / Cerner / FHIR APIs.
3. **Production ML Model Serving**:
   - Time-series queuing network (e.g. LSTM / XGBoost) trained on clinic telemetry.
   - Live probability distributions for patient no-show risks and procedure overruns.
4. **Telephony & SMS Dispatch Gateway**: Twilio or AWS SNS integration for automated parent/patient arrival notifications.
5. **Physical Hardware / Audio Chime Integration**: Real-time PA loudspeaker chime playback for clinic waiting lounges.
6. **Role-Based Access Control (RBAC)**: Multi-tenant authentication ensuring only authorized CMOs / administrators can approve schedule adjustments.
