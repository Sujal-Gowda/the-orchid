# 🌿 The Orchid — Simp’AI’otel

> **A premium, AI-powered hotel concierge for The Orchid.**  
> A full-stack AI Engineer interview project combining grounded AI, deterministic hotel operations, and a polished guest experience.

<p align="center">
  <a href="https://the-orchid-three.vercel.app">
    <img src="https://img.shields.io/badge/Live%20App-The%20Orchid-1f2d2b?style=for-the-badge" alt="Live App">
  </a>
  <a href="https://youtu.be/gaF2gV5fj_k">
    <img src="https://img.shields.io/badge/▶%20Demo%20Video-YouTube-c4302b?style=for-the-badge" alt="Demo Video">
  </a>
  <a href="https://the-orchid-api.onrender.com/docs">
    <img src="https://img.shields.io/badge/API-Swagger-85a3a3?style=for-the-badge" alt="Swagger API">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-Frontend-000000?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white" alt="Google Gemini">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=111111" alt="Render">
</p>

---

**Live Link:** https://the-orchid-three.vercel.app  
**Demo Video:** https://youtu.be/gaF2gV5fj_k  
**Backend API:** https://the-orchid-api.onrender.com  
**Swagger Docs:** https://the-orchid-api.onrender.com/docs  
**GitHub:** https://github.com/Sujal-Gowda/the-orchid

> 📸 Project screenshots are available in [`docs/screenshots`](docs/screenshots/).

---

## 🏨 1. Project Overview

Simp’AI’otel is a conversational hotel concierge designed for The Orchid.

The guest journey is:

1. Discover The Orchid through a premium landing page.
2. Open Simp’AI’otel.
3. Ask natural-language questions about rooms, dining, amenities and policies.
4. Receive grounded hotel information.
5. Ask follow-up questions using session-local context.
6. Ask about availability.
7. Enter check-in, check-out and guest details.
8. Receive deterministic room availability and pricing.
9. Handle no-results and service failures gracefully.

The project deliberately keeps AI responsibilities separate from deterministic hotel business logic.

### 🎯 Core Design Principle

> **Use AI where language understanding helps; use deterministic code where correctness matters.**

This keeps conversational responses flexible while making availability, capacity, dates, inventory and pricing predictable and testable.


---

## ✨ 2. Features

### 🧑‍💼 Guest Experience

- Premium responsive hotel landing page.
- Simp’AI’otel conversational interface.
- Session-local conversation context.
- Follow-up questions.
- Loading and error states.
- Availability form.
- Room result cards.
- Capacity, bed, size, view, highlights and breakfast information.
- Nightly rate and deterministic stay total.
- No-availability handling.
- Responsive desktop, tablet and mobile layouts.

### 🤖 AI / Backend

- FastAPI backend.
- Pydantic request/response validation.
- Curated JSON hotel knowledge base.
- Deterministic hotel-fact retrieval.
- Grounded Gemini responses.
- Structured AI responses.
- Primary Gemini provider.
- Independent Gemini fallback provider.
- Deterministic fallback when both Gemini providers fail.
- Deterministic availability calculation.
- Health endpoint.
- Swagger/OpenAPI documentation.

### ⚙️ Engineering

- Frontend and backend separated.
- Gemini credentials never exposed to the browser.
- Stateless backend.
- Environment-based configuration.
- Automated backend tests.
- Frontend linting and production build verification.
- Git-based incremental development.
- Vercel frontend deployment.
- Render backend deployment.

---

## 🏗️ 3. Architecture

```text
                         ┌──────────────────────┐
                         │      Guest/User      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Next.js Frontend   │
                         │                      │
                         │ Landing / Chat /     │
                         │ Availability / Rooms │
                         └──────────┬───────────┘
                                    │ HTTPS JSON
                                    ▼
                         ┌──────────────────────┐
                         │    FastAPI Backend   │
                         │                      │
                         │ Validation           │
                         │ Retrieval            │
                         │ AI orchestration     │
                         │ Availability         │
                         └──────┬────────┬──────┘
                                │        │
                         Hotel JSON      │
                                │        ▼
                                │   Gemini Primary
                                │        │
                                │     failure
                                │        ▼
                                │   Gemini Fallback
                                │        │
                                │   both fail
                                │        ▼
                                │ Deterministic
                                │ fallback
                                ▼
                         Grounded hotel data
```

### 🔄 Data Flow

For a hotel question:

```text
Question
  ↓
POST /api/chat
  ↓
Validation
  ↓
Deterministic fact retrieval
  ↓
Relevant facts + recent context
  ↓
Gemini structured response
  ↓
Source validation
  ↓
Frontend response
```

For availability:

```text
Availability intent
  ↓
Availability form
  ↓
POST /api/availability
  ↓
Date/guest validation
  ↓
Capacity + inventory filtering
  ↓
Night calculation
  ↓
Deterministic price calculation
  ↓
Room results
```

The LLM is **not** responsible for room availability, capacity, dates or price calculations.

---

## 💡 Why This Architecture?

The project intentionally separates **conversation** from **hotel operations**:

- 🧠 **Gemini** handles natural-language generation.
- 📚 **Curated JSON retrieval** keeps answers grounded in known hotel information.
- 🧮 **Deterministic Python logic** handles availability, dates, capacity, inventory and pricing.
- 🔁 **Provider failover** gives the AI layer a second execution path.
- 🔒 **Backend-only secrets** keep Gemini credentials out of the browser.
- 📦 **Stateless services** keep the deployment simple and portable.

This makes the system easier to test, explain and evolve without introducing unnecessary infrastructure.

---

## 🧰 4. Technology Stack

### 🖥️ Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons
- React Hook Form / validation patterns

### 🔌 Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- python-dotenv

### 🧠 AI

- Google Gemini API
- `gemini-3.1-flash-lite`
- Two Gemini API keys/projects for provider failover

### 🗂️ Data

- Curated JSON hotel knowledge base
- Deterministic room inventory/rules

### 🧪 Testing

- pytest
- FastAPI TestClient / HTTPX
- ESLint
- Next.js production build
- Manual end-to-end evaluation

### 🚀 Deployment

- Vercel — frontend
- Render — backend
- GitHub — source control

---

## 📁 5. Repository Structure

```text
the-orchid/
├── backend/
│   ├── api/
│   │   └── routes.py
│   ├── data/
│   │   ├── hotel.json
│   │   └── inventory.json
│   ├── models/
│   │   └── schemas.py
│   ├── services/
│   │   ├── ai.py
│   │   ├── availability.py
│   │   ├── retrieval.py
│   │   └── providers/
│   │       └── gemini.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   │   └── rooms/
│   ├── .env.example
│   └── package.json
├── tests/
├── docs/
├── .gitignore
└── README.md
```

---

## 📋 6. Prerequisites

Recommended development environment:

- Python 3.11+
- Node.js 20+
- npm
- Git
- Google Gemini API key

The project was developed and tested locally with Python 3.11.9 and Node.js 24.11.1.

---

## 🛠️ 7. Local Setup

### Clone

```bash
git clone https://github.com/Sujal-Gowda/the-orchid.git
cd the-orchid
```

### 🔌 Backend

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Create `.env` in the project root:

```env
GEMINI_API_KEY_PRIMARY=your_primary_gemini_api_key
GEMINI_API_KEY_FALLBACK=your_fallback_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
```

Never commit `.env` or API keys.

Run:

```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Health:

```text
http://127.0.0.1:8000/health
```

### 🖥️ Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔌 8. API Reference

### Health

```bash
curl http://127.0.0.1:8000/health
```

Response:

```json
{
  "status": "ok",
  "service": "the-orchid-api"
}
```

### Hotel data

```bash
curl http://127.0.0.1:8000/api/hotel
```

### Chat

`POST /api/chat`

Example:

```json
{
  "message": "What are the breakfast timings?",
  "session_id": "demo-session-1",
  "context": []
}
```

cURL:

```bash
curl -X POST "http://127.0.0.1:8000/api/chat"   -H "Content-Type: application/json"   -d '{
    "message": "What are the breakfast timings?",
    "session_id": "demo-session-1",
    "context": []
  }'
```

A successful grounded response has the following structure:

```json
{
  "type": "answer",
  "message": "Breakfast is served ...",
  "sources": [
    {
      "id": "dining.breakfast",
      "label": "Breakfast"
    }
  ],
  "provider": "gemini-primary",
  "grounded": true
}
```

### Availability

`POST /api/availability`

Example:

```json
{
  "check_in": "2026-10-10",
  "check_out": "2026-10-12",
  "guests": 2
}
```

cURL:

```bash
curl -X POST "http://127.0.0.1:8000/api/availability"   -H "Content-Type: application/json"   -d '{
    "check_in": "2026-10-10",
    "check_out": "2026-10-12",
    "guests": 2
  }'
```

Response structure:

```json
{
  "type": "availability_results",
  "criteria": {
    "check_in": "2026-10-10",
    "check_out": "2026-10-12",
    "guests": 2,
    "nights": 2
  },
  "rooms": [
    {
      "id": "courtyard-king",
      "name": "Courtyard King",
      "capacity": 2,
      "nightly_rate_inr": 9800,
      "stay_total_inr": 19600,
      "available": true
    }
  ]
}
```

Actual room results depend on the requested dates and guest count.

---

## 🧮 9. Deterministic Availability

Availability is deliberately independent of the LLM.

The backend:

1. Validates the check-in date.
2. Validates checkout is after check-in.
3. Rejects past check-in dates.
4. Validates guest count.
5. Applies room capacity rules.
6. Applies deterministic inventory/blocked-date rules.
7. Calculates number of nights.
8. Calculates the stay total in Python.
9. Returns only eligible rooms.

Pricing is:

```text
stay_total = nightly_rate × number_of_nights
```

This prevents an LLM from inventing availability or prices.

---

## 📚 10. Hotel Knowledge Base

The controlled hotel dataset contains information such as:

- Room types
- Capacities
- Bed configurations
- Room sizes
- Views
- Highlights
- Nightly rates
- Breakfast
- Dining
- Amenities
- Cancellation policy
- Smoking policy
- Pet policy
- Children policy
- Identification requirements
- Extra-bed information
- Room images
- Inventory rules

The assistant should not invent hotel facts that are not present in the controlled dataset.

---

## 🧠 11. AI Architecture

```text
User question
      ↓
Deterministic retrieval
      ↓
Relevant hotel facts
      ↓
Gemini Primary
      │
      ├── success → structured response
      │
      └── failure
              ↓
        Gemini Fallback
              │
              ├── success → structured response
              │
              └── failure
                      ↓
              deterministic fallback
```

Two Gemini API keys/projects are used so that a second Gemini provider can be attempted if the primary project reaches its quota or becomes unavailable.

AI is used for natural-language generation, while deterministic application code controls business rules.

---

## 🎨 12. Product / UX Decisions

### Premium, simple visual language

The UI uses warm neutrals, generous spacing, large typography, soft surfaces and subtle motion to create a premium hotel experience rather than a generic chatbot.

### Conversational first

Guests can ask natural-language questions instead of navigating a large information hierarchy.

### Progressive disclosure

The landing page introduces Simp’AI’otel and opens the full concierge only when the guest chooses to interact.

### Structured availability flow

Natural language is appropriate for discovery, but availability requires reliable structured inputs. The assistant therefore transitions into a form for dates and guests.

### Room comparison

Room cards expose capacity, bed, size, view, breakfast, highlights, nightly rate and total stay price.

---

## ⚙️ 13. Engineering Decisions

### 🔌 Backend-only API keys

Gemini credentials are never sent to the browser.

The frontend only receives:

```env
NEXT_PUBLIC_API_BASE_URL
```

### Stateless backend

The current version does not require a database or Redis. Recent conversation context is passed by the frontend.

### Deterministic business logic

Availability, dates, capacity, inventory and pricing are normal application logic rather than LLM decisions.

### Controlled data

A small curated JSON knowledge base keeps the interview demo predictable and auditable.

### Focused architecture

The project intentionally avoids unnecessary infrastructure such as microservices, vector databases, OCR, local model hosting and large agent frameworks.

---

## 🧪 14. Testing and Evaluation

Latest automated backend test result:

```text
16 passed
```

Integration test:

```text
1 passed
15 deselected
```

Frontend lint:

```text
0 errors
1 warning
```

Frontend production build:

```text
Compiled successfully
Finished TypeScript
Generating static pages
```

The remaining lint warning is related to the standard HTML `<img>` element in the room results component.

### Manual guest journey

| Scenario | Result |
|---|---|
| Basic hotel knowledge | Passed locally |
| Amenity question | Passed locally |
| Follow-up question | Passed locally |
| Availability intent | Passed |
| Valid availability | Passed |
| No availability | Passed |
| Room results | Passed |
| Room images | Passed |
| Responsive UI | Passed |
| Backend health | Passed |
| Swagger documentation | Passed |
| Production frontend | Passed |
| Production backend | Passed |

### ⚠️ Production note

The deployed application currently has a known issue with the `/api/chat` AI response path in production. The deployed infrastructure and deterministic availability flow are working.

The issue is documented rather than hidden and is planned for post-deployment debugging. Local automated tests and the local guest journey passed before deployment.

---

## 🚀 15. Deployment

### 🖥️ Frontend

Hosted on Vercel:

```text
https://the-orchid-three.vercel.app
```

Production environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://the-orchid-api.onrender.com
```

### 🔌 Backend

Hosted on Render:

```text
https://the-orchid-api.onrender.com
```

Endpoints:

```text
GET  /health
GET  /api/hotel
POST /api/chat
POST /api/availability
GET  /docs
```

Production CORS:

```env
FRONTEND_ORIGIN=https://the-orchid-three.vercel.app
```

---

## 🔐 16. Security

- Gemini keys are stored only in backend environment variables.
- Gemini keys are not included in the frontend deployment.
- `.env` files are excluded from source control.
- Production communication uses HTTPS.
- API input is validated with Pydantic.
- Conversation input has length limits.
- Guest count and date fields are validated.

---


## 🚫 17. Out of Scope

The current version does not implement:

- Actual room booking
- Payments
- Guest authentication
- Multiple hotel properties
- In-room dining ordering
- Service dispatch
- Hotel administration dashboard
- PMS/reservation-system integration
- Persistent guest profiles
- Database-backed conversation history
- Vector database
- Local LLM hosting
- OCR
- Complex autonomous agents

---

## 🔭 18. Future Improvements

1. Resolve and improve the production `/api/chat` issue.
2. Add stronger retrieval aliases/semantic retrieval.
3. Integrate real hotel inventory or a PMS.
4. Add a real booking flow.
5. Add streaming AI responses.
6. Add richer source/provenance UI.
7. Add frontend unit tests.
8. Add Playwright browser E2E tests.
9. Add CI for linting and tests.
10. Add production monitoring and structured logs.
11. Add rate limiting and abuse protection.

---

## ⚡ 19. Quick Start

```bash
git clone https://github.com/Sujal-Gowda/the-orchid.git
cd the-orchid
```

Backend:

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend, in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---


## 🔗 20. Project Links

**Repository:**  
https://github.com/Sujal-Gowda/the-orchid

**Live Link:**  
https://the-orchid-three.vercel.app

**Demo Video:**  
https://youtu.be/gaF2gV5fj_k

**Backend API:**  
https://the-orchid-api.onrender.com

**Swagger API Docs:**  
https://the-orchid-api.onrender.com/docs

---

## 📌 Project Status

**Deployed and submission-ready.**

The current focus is the deployed guest experience. The production `/api/chat` issue is a known follow-up engineering task; the deployment, frontend, backend infrastructure and deterministic availability experience are live.

**The Orchid × Simp’AI’otel**

> *A focused demonstration of grounded AI, deterministic business logic, full-stack integration, and premium guest experience design.*

