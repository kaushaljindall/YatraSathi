# YatraSaathi — Setup Guide

This guide provides instructions to spin up the YatraSaathi AI Travel Platform locally.

## Prerequisites
- Python 3.10+
- **Redis**: Strongly recommended for low-latency caching in the Ziva AI real-time translation pipeline (runs on port 6379). If unavailable, the system safely bypasses it.
- **FFmpeg**: Must be installed and available in system PATH (required for Edge-TTS audio processing).
- **3D Avatar Models**: Ensure `Ziva.glb`, `Animations.glb` are placed in `frontend/react-chatbot/public/models/` for the React Three Fiber rendering.
- Node.js (Required for Vite/React frontend)
- A Groq API Key
- An OpenWeatherMap API Key

## 1. Environment Configuration
Create a `.env` file in the `backend/` directory by copying the example file:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and fill in your keys:
- `GROQ_API_KEY=your_groq_api_key_here`
- `OPENWEATHERMAP_API_KEY=your_openweathermap_api_key`
- `SECRET_KEY=generate_a_random_secure_string_here`

## 2. Backend Installation
Navigate to the backend directory and install the Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

*(Note: Depending on your Python version, you may need to install compatible versions of `faiss-cpu` or build `sentence-transformers` locally.)*

## 3. RAG Knowledge Base Seeding
YatraSaathi uses a FAISS vector store to ground the LLM with real, localized city knowledge (Attractions, Transport, Scams, Food, etc.).

Before starting the server, you must seed the vector store:
```bash
python -m data.seed_rag
```
This will process the data from `data/seed_rag.py` and populate `data/faiss_index.index` and `data/rag_metadata.json`.

## 4. Run the Server
Start the FastAPI backend with hot-reload enabled:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 5. Launch the React Chatbot (Port 5173)
YatraSaathi uses a React Micro-Frontend for the 3D Ziva Avatar. Open a new terminal:
```bash
cd frontend/react-chatbot
npm install
npm run dev
```

## 6. Launch the Main Website (Port 3000)
The main frontend is built using lightweight Vanilla HTML/CSS/JS.

You must run a local server (e.g., VS Code Live Server, or Python's HTTP server) on port 3000 so the iframe bridge works without CORS issues:
```bash
cd frontend
python -m http.server 3000
```
Then navigate to `http://localhost:3000/home.html` in your browser.

## 7. Accessing the App
1. Go to the main frontend at `http://localhost:3000`.
2. Sign up or log in (the database is a local JSON file `backend/data/database.json`, so no external DB is needed).
3. Click the floating **Robot Button** in the bottom right corner to spawn the React-powered Ziva 3D Avatar!
4. Navigate to **Planner** to generate an AI itinerary.
5. Try out **City Insights** to query the RAG database.

---
**Note:** If you encounter `ModuleNotFoundError: No module named 'pytz'`, manually run `pip install pytz aiofiles`.
