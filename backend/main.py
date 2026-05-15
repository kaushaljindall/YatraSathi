from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import asyncio

from config.settings import settings
from config.database import read_db, write_db
from routes import auth, planner, city, weather, expenses, budget, conversation, predictive, ecosystem
from voice.voice_router import router as voice_router
from websocket import live_updates
from realtime.realtime_scheduler import scheduler
from monitoring.health_checks import router as health_router
from monitoring.performance_tracker import performance_tracking_middleware
from monitoring.logging_engine import app_logger
from security.security_headers import security_headers_middleware
from security.rate_limiter import rate_limiter
from scaling.task_queue import task_queue

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def lifespan(app: FastAPI):
    # Start real-time background monitor
    monitoring_task = asyncio.create_task(scheduler.start_monitoring())
    # Start background task queue worker
    queue_task = asyncio.create_task(task_queue.worker())
    app_logger.info("startup", message="YatraSaathi backend fully initialised.")
    yield
    scheduler.is_running = False
    monitoring_task.cancel()
    queue_task.cancel()
    app_logger.info("shutdown", message="YatraSaathi backend shut down cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scalable AI-powered smart travel assistant platform.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Security Headers Middleware ────────────────────────────────────
app.middleware("http")(security_headers_middleware)

# ── Performance Tracking Middleware ───────────────────────────────
app.middleware("http")(performance_tracking_middleware)

# ── CORS Middleware ────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock down to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global Exception Handler ───────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    app_logger.error("unhandled_exception", error=str(exc), path=str(request.url))
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "An internal server error occurred."},
    )

# ── API Routers ────────────────────────────────────────────────────
V1 = settings.API_V1_STR

app.include_router(auth.router,          prefix=f"{V1}/auth",      tags=["Authentication"])
app.include_router(planner.router,       prefix=f"{V1}/planner",   tags=["AI Trip Planner"])
app.include_router(city.router,          prefix=f"{V1}/city",      tags=["RAG City Insights"])
app.include_router(weather.router,       prefix=f"{V1}/weather",   tags=["Weather Intelligence"])
app.include_router(expenses.router,      prefix=f"{V1}/expenses",  tags=["Expense Tracking"])
app.include_router(budget.router,        prefix=f"{V1}/budget",    tags=["Budget Intelligence"])
app.include_router(conversation.router,  prefix=f"{V1}",           tags=["Conversational AI & Agents"])
app.include_router(voice_router,         prefix=f"{V1}/voice",     tags=["Voice Intelligence"])
app.include_router(predictive.router,    prefix=f"{V1}",           tags=["Predictive Intelligence"])
app.include_router(ecosystem.router,     prefix=f"{V1}",           tags=["Multimodal & Ecosystem (Phase 8)"])
app.include_router(health_router,                                   tags=["Health & Monitoring"])
app.include_router(live_updates.router,                             tags=["Live WebSockets"])

@app.get("/metrics")
async def metrics_endpoint():
    from monitoring.metrics import metrics
    return metrics.get_summary()
