# YatraSaathi — Complete Backend Architecture

## Tech Stack
- **Framework:** FastAPI + Python 3.10
- **Storage:** JSON File DB (`data/db.json`) — no external DB required
- **AI/LLM:** Groq API (`llama3-8b-8192`)
- **Embeddings:** sentence-transformers (`all-MiniLM-L6-v2`)
- **Vector DB:** FAISS (local, persistent)
- **Voice STT:** OpenAI Whisper
- **Voice TTS:** Edge-TTS
- **Real-time:** FastAPI WebSockets
- **Auth:** JWT (python-jose + passlib bcrypt)

---

## Phase 2 — Core API Infrastructure
```
backend/
├── main.py                    # FastAPI app entrypoint, lifespan, CORS
├── config/
│   ├── settings.py            # Pydantic BaseSettings
│   └── database.py            # Async JSON DB (read_db/write_db)
├── auth/
│   ├── security.py            # Bcrypt hashing, JWT creation
│   └── dependencies.py        # get_current_user OAuth2 bearer
├── schemas/
│   ├── user.py                # UserCreate, UserResponse, Token
│   └── trip.py                # ItineraryGenerateRequest, CityInsightRequest
└── routes/
    ├── auth.py                # POST /signup, POST /login
    ├── planner.py             # POST /planner/generate-trip
    ├── city.py                # POST /city/city-insights
    ├── weather.py             # GET /weather/
    ├── expenses.py            # POST /expenses/add, GET /expenses/trip/{id}
    └── budget.py              # POST /budget/analyze
```

## Phase 3 — RAG & AI Intelligence
```
backend/
├── rag/
│   ├── chunking.py            # HTML cleanup, overlapping word chunks
│   ├── embeddings.py          # SentenceTransformer batch embedding
│   ├── vector_store.py        # FAISS IndexFlatIP with metadata store
│   ├── ingestion.py           # Raw data → chunks → FAISS
│   ├── hybrid_search.py       # Semantic search + city metadata filter
│   ├── ranking.py             # Score-based re-ranking with metadata boosting
│   ├── retriever.py           # Orchestrates search → rank → context assembly
│   ├── memory.py              # Per-user query history (last 5)
│   └── query_engine.py        # Unified RAG payload builder
└── ai/
    ├── llm_service.py         # Async Groq API wrapper
    ├── prompt_engineering.py  # City, itinerary, scam prompts
    ├── itinerary_ai.py        # RAG-grounded itinerary generator
    ├── personalization.py     # Implicit user profile tracker
    └── recommendation_engine.py # Full RAG → LLM recommendation pipeline
```

## Phase 4 — Real-Time Intelligence
```
backend/
├── services/
│   ├── weather_service.py     # OpenWeatherMap async fetcher
│   ├── traffic_service.py     # Traffic delay analysis
│   ├── event_service.py       # Local events (festivals, concerts)
│   └── pricing_service.py     # Surge detection for taxis/hotels
├── realtime/
│   ├── weather_engine.py      # Weather → activity impact analysis
│   ├── traffic_engine.py      # Delay detection → rerouting advice
│   ├── crowd_engine.py        # Peak-hour tourist congestion prediction
│   ├── pricing_engine.py      # Surge pricing alert
│   ├── event_engine.py        # Event impact on routes/crowds
│   ├── notification_engine.py # WebSocket push alerts
│   └── realtime_scheduler.py  # asyncio background loop (every 5 min)
├── orchestration/
│   ├── decision_engine.py     # Aggregates all signals → viable/broken/delayed
│   ├── adaptive_planner.py    # RAG + LLM alternative generation
│   ├── optimization_engine.py # Route/schedule reordering
│   └── ai_orchestrator.py     # Master orchestration brain
└── ws_handler/
    └── live_updates.py        # WebSocket connection manager + /ws/{user_id}
```

## Phase 5 — Budget Financial Intelligence
```
backend/
└── budget/
    ├── expense_tracker.py     # Heuristic expense categorization
    ├── pricing_engine.py      # City price averages, markup detection
    ├── scam_detection.py      # Tourist trap / scam pattern analysis
    ├── overspending_detector.py # Daily burn rate calculation
    ├── affordability_engine.py # Full trip financial sustainability check
    ├── analytics_engine.py    # Dashboard-ready pie/bar chart payloads
    ├── financial_ai.py        # Groq LLM financial advice generation
    └── budget_engine.py       # Master orchestrator for all budget modules
```

## Phase 6 — Voice, Translation & Agentic AI
```
backend/
├── voice/
│   ├── stt_engine.py          # Whisper speech-to-text
│   ├── tts_engine.py          # Edge-TTS text-to-speech
│   ├── audio_processing.py    # Audio normalization pipeline
│   ├── wakeword_support.py    # "Hey YatraSaathi" trigger (Porcupine-ready)
│   └── voice_router.py        # POST /voice/transcribe, POST /voice/respond
├── translation/
│   ├── language_detector.py   # ISO 639-1 language identification
│   ├── translator.py          # Google Translate / LibreTranslate wrapper
│   └── multilingual_responses.py # Auto-translate AI responses to user language
├── conversation/
│   ├── memory_engine.py       # Per-user conversation history (last 10)
│   ├── context_manager.py     # Active trip state (city, activity, weather)
│   ├── intent_engine.py       # Keyword-based intent classification
│   └── dialogue_manager.py    # Aggregates memory + context + intent
└── agentic/
    ├── planner_agent.py        # Itinerary modification agent
    ├── budget_agent.py         # Financial coaching agent
    ├── recommendation_agent.py # Nearby places agent
    ├── safety_agent.py         # Emergency + scam protection agent
    ├── booking_agent.py        # Booking infrastructure (extensible)
    ├── translation_agent.py    # In-trip translation agent
    ├── orchestration.py        # Intent → agent dispatcher
    └── task_manager.py         # MASTER entry point for all interactions
```

---

## Key API Endpoints (all under `/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | JWT login |
| POST | `/planner/generate-trip` | RAG-grounded itinerary |
| POST | `/city/city-insights` | RAG city intelligence |
| GET | `/weather/` | Live weather |
| POST | `/expenses/add` | AI-categorized expense |
| POST | `/budget/analyze` | Full financial dashboard |
| POST | `/conversation/chat` | 🆕 Conversational AI (intent → agent) |
| POST | `/translate/text` | 🆕 Multilingual translation |
| POST | `/agent/task` | 🆕 Direct agent dispatch |
| POST | `/intent/analyze` | 🆕 Intent detection |
| POST | `/voice/transcribe` | 🆕 Whisper STT |
| POST | `/voice/respond` | 🆕 Edge-TTS response |
| WS | `/ws/{user_id}` | Live WebSocket updates |
| GET | `/health` | Health check |
