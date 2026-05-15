from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from config.settings import settings
from config.database import read_db, write_db
from routes import auth, planner, city, weather, expenses, budget, conversation
from voice.voice_router import router as voice_router
from websocket import live_updates
from realtime.realtime_scheduler import scheduler
import asyncio

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def lifespan(app: FastAPI):
    # Start the real-time background monitor
    task = asyncio.create_task(scheduler.start_monitoring())
    yield
    scheduler.is_running = False
    task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scalable AI-powered smart travel assistant platform.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "An internal server error occurred."}
    )

# Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(planner.router, prefix=f"{settings.API_V1_STR}/planner", tags=["AI Trip Planner"])
app.include_router(city.router, prefix=f"{settings.API_V1_STR}/city", tags=["RAG City Insights"])
app.include_router(weather.router, prefix=f"{settings.API_V1_STR}/weather", tags=["Weather Intelligence"])
app.include_router(expenses.router, prefix=f"{settings.API_V1_STR}/expenses", tags=["Expense Tracking"])
app.include_router(budget.router, prefix=f"{settings.API_V1_STR}/budget", tags=["Budget Intelligence"])
app.include_router(live_updates.router, tags=["Live WebSockets"])
app.include_router(conversation.router, prefix=f"{settings.API_V1_STR}", tags=["Conversational AI & Agents"])
app.include_router(voice_router, prefix=f"{settings.API_V1_STR}/voice", tags=["Voice Intelligence"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": settings.VERSION}
