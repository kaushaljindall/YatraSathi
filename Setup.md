# YatraSaathi — Setup Guide

This guide provides instructions to spin up the YatraSaathi AI Travel Platform locally.

## Prerequisites
- Python 3.10+
- **Redis**: Must be running locally on port 6379 for caching
- **FFmpeg**: Must be installed and available in system PATH
- Node.js (for any future frontend build steps, though currently frontend is vanilla JS)
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

## 5. Launch the Frontend
The frontend is currently built using Vanilla HTML/CSS/JS to keep it lightweight.

Simply open `frontend/index.html` in your web browser. Or, run a local static server:
```bash
cd frontend
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your browser.

## 6. Accessing the App
1. Go to the frontend.
2. Sign up or log in (the database is a local JSON file `backend/data/database.json`, so no external DB is needed).
3. Navigate to **Planner** to generate an AI itinerary.
4. Try out **City Insights** to query the RAG database.
5. Interact with **Ziva AI Avatar**, the real-time multilingual 3D voice assistant.

---
**Note:** If you encounter `ModuleNotFoundError: No module named 'pytz'`, manually run `pip install pytz aiofiles`.
