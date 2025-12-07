# Healthcare Symptom Checker (AI-powered)

Medicheck is an intelligent web-based health assistance system designed to analyze user-reported symptoms and provide probable disease predictions along with basic medical guidance. The system uses Artificial Intelligence and Machine Learning concepts to understand symptoms entered in natural language and generate meaningful health-related insights. It helps users take an initial step toward understanding their health condition before consulting a medical professional. The project aims to bridge the gap between patients and healthcare awareness through an easy-to-use digital platform.
---

## 🚀 Objective

The main objective of the Symptom AI project is to develop a smart and reliable AI-based system that can assist users in identifying possible medical conditions based on their symptoms and guide them with precautionary advice.

---

## 🛠️ Features & Scope

- **Symptom Input:** Users enter symptoms using natural language for easy interaction
- **API (Backend):** Accepts queries, manages chat history, and communicates with the LLM
- **LLM Integration:** Uses a large language model to analyze symptoms and suggest possible conditions safely
- **Frontend:** Modern, responsive React-based interface for chat and results display
- **Database:** Stores user session history for analytics/recall
- **Safety:** Every response includes medical disclaimers and avoids direct treatment prescriptions

---

## 🏗️ Technical Implementation

- **Frontend:** React (+ Vite), protected routes, session/history management, responsive UI
- **Backend:** Node.js, Express, modular code, LLM communication logic externalized for clarity
- **APIs:**
  - `POST /api/assessment/chat` — Input symptoms, get LLM-powered responses (Q&A or final result)
  - `GET /api/assessment/history` — Retrieve user’s previous assessment sessions and results
- **Large Language Model (LLM)** Uses llama-3.1-8b-instant, a fast and efficient open-weight Large Language Model, to analyze user-entered symptoms written in natural language and generate safe, medically responsible responses.
- **Database:** Supabase as its backend database service, which is built on top of PostgreSQL, for storing user session data and chat history.
---

## ✨ Usage (Local Dev)

### Frontend

```bash
cd symptom-frontend
npm install
npm run dev
# then open http://localhost:5173
```

Set the backend URL by adding `.env` to `symptom-frontend/`:

```
VITE_BACKEND_BASEURL=http://localhost:5003
```

### Backend

```bash
cd symptom-backend
npm install
# Confirm your .env and database config
npm start
# runs on http://localhost:5003
```

