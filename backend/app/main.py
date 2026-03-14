from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import trip_router, itinerary_router, assistant_router, hotel_router

app = FastAPI(
    title=settings.app_name,
    description="YatraSathi Backend Platform - AI Travel Planning",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(trip_router.router)
app.include_router(itinerary_router.router)
app.include_router(assistant_router.router)
app.include_router(hotel_router.router)

@app.get("/", tags=["Health"])
def health_check():
    """Health check endpoint to ensure API is up and running."""
    return {"message": f"Welcome to {settings.app_name}", "status": "running"}

# to run: uvicorn app.main:app --reload
