# MediFlow AI — Specialty-Aware AI-Driven Clinic Queue & Flow Optimizer

MediFlow AI is an editorial, high-performance healthcare management web application and FastAPI backend service. It integrates multi-department capacity orchestration, dynamic exam bay allocation, real-time token calling, concurrency-safe queue state transitions, and machine-learning wait-time forecasting with enforced administrator approval.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React 18 + Vite Frontend             │
│        (Neon Bloom Theme matching Google Stitch)       │
└───────────────────────────┬────────────────────────────┘
                            │ REST / WebSocket
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│  ├── Auth & RBAC (Admin / Doctor / Receptionist JWT)   │
│  ├── Queue State Machine (Optimistic Locking)          │
│  ├── ML Inference Engine (Trained RandomForest & GBR)  │
│  └── Real-Time WebSocket Channel (/ws/queue)           │
└───────────────────────────┬────────────────────────────┘
                            │ SQLAlchemy ORM
┌───────────────────────────▼────────────────────────────┐
│           Database (PostgreSQL / SQLite)               │
│   Specialties • Doctors • Bays • Queue • Appointments   │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Google Stitch Screen Reference Mapping

All 8 screens from Google Stitch Project `10848362290459231529` are implemented as cohesive, interactive views:

| # | Stitch Reference | Screen Name | Route | Implemented Functionality |
|---|---|---|---|---|
| **Primary** | `screens/9e92e8de41ef4d20adf9167c42ae8956` | **Operations Dashboard & Queue Optimization** | `/` or `/operations` | 5 KPI metrics, Hero AI Rebalance card, Live token manifest, Exam room status, Hourly LSTM trajectory. |
| **1** | `screens/55fdad02ba9a4554b8ba37726ce26f61` | **Live Queue & Room Assignment Hub** | `/live-queue` | Token calling, status pills, audio chime broadcast modal, hold queue toggle, exam room allocation grid. |
| **2** | `screens/222899ef250741b29eacd3d5f0bd2e6c` | **Patient Appointment Booking & Confirmation** | `/appointments` | 4-Stage clinical flow (Patient ID → Specialty → AI Doctor Match → Pass), past bookings manifest, SMS alerts. |
| **3** | `screens/bbdf24e0e17c4ffd9236142f7f3633b9` | **Specialty Management & Bay Allocation** | `/specialties` | 5 Clinical Wings (Cardiology, Dermatology, Pediatrics, Orthopedics, Ophthalmology), 24 bay statuses, cross-cover triage. |
| **4** | `screens/fec6c37d9b88446fb7a74f74330a6715` | **Doctors & Staff Schedule & Workload Allocation** | `/staff-schedule` | Practitioner availability, shift hours, workload intensity gauges, dynamic doctor status toggling. |
| **5** | `screens/0711728926fd423c88832223d641ee7d` | **Predictive Bottleneck Deep-Dive (AI Insights)** | `/ai-insights` | Delay attribution decomposition, confidence scores, 3 pending AI rebalance actions with Admin approval modal. |
| **6** | `screens/9574c61e5d624aceac19ec53fb93f24e` | **Analytics & Operational Intelligence** | `/analytics` | Wait-time benchmarks, daily throughput volume, SLA breach rates, consultation duration variance. |
| **7** | `screens/d6bed7d70daf464eb372387686f49b88` | **Clinic Settings & Alert Notification Center** | `/settings` | Real-time notification feed, SLA threshold slider, Human-in-the-loop AI enforcement, notification templates. |

---

## 🔒 Authentication & Role-Based Access Control (RBAC)

Default seed accounts (passwords hashed via bcrypt):

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator / CMO** | `admin@mediflow.ai` | `adminpassword123` | Full governance, AI schedule approval, system configuration. |
| **Attending Doctor** | `doctor.chen@mediflow.ai` | `doctorpassword123` | Room status updates, admitting assigned patients, completing exams. |
| **Intake Receptionist** | `receptionist@mediflow.ai` | `staffpassword123` | Patient intake, appointment booking, emergency priority triage. |

---

## ⚡ Concurrency Control & State Machine

The Queue Service enforces strict transition rules:
- `Waiting` → `Calling`, `Delayed`, `Cancelled`
- `Calling` → `In Consultation`, `Waiting`, `Delayed`
- `In Consultation` → `Completed`, `Delayed`
- `Delayed` → `Waiting`, `Calling`, `Cancelled`

**Optimistic Locking**: Every queue item contains a `version_id`. Updates verify `WHERE id = :id AND version_id = :version_id`. If concurrent updates occur simultaneously by multiple staff members, the transaction aborts with an HTTP `409 Conflict`, preventing double-calling or lost updates.

---

## 🤖 Machine Learning Model & Evaluation Metrics

The prediction engine is trained on 2,500 synthetic clinic encounters modeled after healthcare distributions:

### 1. Consultation Duration Predictor (RandomForestRegressor)
- **Mean Absolute Error (MAE)**: `2.22 minutes`
- **Root Mean Squared Error (RMSE)**: `2.82 minutes`
- **$R^2$ Score**: `0.6871`

### 2. Waiting Time Predictor (GradientBoostingRegressor)
- **Mean Absolute Error (MAE)**: `9.61 minutes`
- **Root Mean Squared Error (RMSE)**: `14.44 minutes`
- **$R^2$ Score**: `0.9356`

*Model bundle saved in `backend/app/ml/models/mediflow_ml_bundle.joblib`.*

---

## 🚀 Running the Full Stack Application

### 1. Backend Service (FastAPI)
```powershell
# Activate venv
.\backend\.venv\Scripts\Activate.ps1

# Run tests
$env:PYTHONPATH="."
.\backend\.venv\Scripts\pytest.exe backend\tests\test_api.py -v

# Start FastAPI server on port 8000
.\backend\.venv\Scripts\uvicorn.exe backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation (Swagger UI): **http://localhost:8000/docs**

### 2. Frontend Application (React + Vite)
```powershell
npm.cmd run dev
```
Client URL: **http://localhost:3000**

---

## 🔌 Modular Integrations

- **Notifications Module** (`backend/app/modules/notifications`): Configurable provider interface with `MockNotificationProvider` and `LogNotificationProvider`.
- **FHIR Client** (`backend/app/modules/fhir`): Patient identifier resolver with standalone simulation mode.
- **Audio Announcement** (`backend/app/modules/audio`): PA loudspeaker chime synthesis payload formatter.
