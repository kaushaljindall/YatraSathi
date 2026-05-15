from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from auth.dependencies import get_current_user
from super_ai.global_ai_orchestrator import global_ai_orchestrator
from super_ai.emotional_ai import emotional_ai
from super_ai.predictive_core import predictive_core
from super_ai.adaptive_learning import adaptive_learning
from mobility.mobility_intelligence import mobility_intelligence
from mobility.smart_navigation import smart_navigation
from personalization.travel_memory import travel_memory
from personalization.behavior_learning import behavior_learning
from simulation.trip_simulator import trip_simulator
from simulation.scenario_engine import scenario_engine
from realtime_extended.global_event_engine import global_event_engine
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)


# ── Super AI: Orchestrator ──────────────────────────────────────────

class SuperChatRequest(BaseModel):
    message: str
    trip_context: Optional[dict] = None

@router.post("/super/chat")
async def super_chat(request: SuperChatRequest, current_user: dict = Depends(get_current_user)):
    """
    The ultimate chat endpoint. Routes through the Global AI Orchestrator,
    incorporating emotional intelligence, adaptive learning, and agent dispatch.
    """
    user_id = current_user.get("id", 0)
    result = await global_ai_orchestrator.process(user_id, request.message, request.trip_context)
    return {"success": True, "data": result}

@router.post("/super/emotional-check")
async def emotional_check(request: SuperChatRequest, current_user: dict = Depends(get_current_user)):
    """Analyses the emotional stress level in a user's message."""
    result = emotional_ai.analyze_stress(request.message)
    return {"success": True, "data": result}

@router.get("/super/profile/{user_id}")
async def get_learning_profile(user_id: int, current_user: dict = Depends(get_current_user)):
    """Returns the AI-built adaptive learning profile for the user."""
    profile = adaptive_learning.get_profile(user_id)
    return {"success": True, "profile": profile}


# ── Predictive Risk ─────────────────────────────────────────────────

class RiskRequest(BaseModel):
    city: str
    budget: float
    hour: int = datetime.utcnow().hour
    month: int = datetime.utcnow().month

@router.post("/super/risk-assessment")
async def full_risk_assessment(request: RiskRequest, current_user: dict = Depends(get_current_user)):
    """Unified risk score combining weather, crowd, and pricing signals."""
    result = await predictive_core.full_risk_assessment(
        request.city, request.hour, request.month, request.budget
    )
    return {"success": True, "data": result}


# ── Mobility Intelligence ──────────────────────────────────────────

class MobilityRequest(BaseModel):
    distance_km: float
    priority: str = "balanced"  # balanced | budget | fast | comfort | eco

class NavigationRequest(BaseModel):
    origin: str
    destination: str
    mode: str = "taxi"
    conditions: dict = {}

@router.post("/mobility/recommend")
async def mobility_recommend(request: MobilityRequest, current_user: dict = Depends(get_current_user)):
    """Scores all transport modes for a trip leg and recommends the best option."""
    result = mobility_intelligence.recommend_best(request.distance_km, request.priority)
    return {"success": True, "data": result}

@router.post("/mobility/navigate")
async def navigate(request: NavigationRequest, current_user: dict = Depends(get_current_user)):
    """Returns a dynamic route with live condition adjustments."""
    result = await smart_navigation.get_route(
        request.origin, request.destination, request.mode, request.conditions
    )
    return {"success": True, "data": result}


# ── Personalization & Memory ───────────────────────────────────────

class MemoryRequest(BaseModel):
    key: str
    value: str

class FeedbackRequest(BaseModel):
    recommendation_id: str
    accepted: bool
    category: str

@router.post("/memory/store")
async def store_memory(request: MemoryRequest, current_user: dict = Depends(get_current_user)):
    """Stores a long-term memory entry for the user."""
    user_id = current_user.get("id", 0)
    travel_memory.remember(user_id, request.key, request.value)
    return {"success": True, "message": f"Remembered: {request.key}"}

@router.get("/memory/recall")
async def recall_memory(current_user: dict = Depends(get_current_user)):
    """Recalls all long-term memory for the current user."""
    user_id = current_user.get("id", 0)
    mem = travel_memory.recall_all(user_id)
    return {"success": True, "memory": mem}

@router.post("/feedback/recommendation")
async def submit_feedback(request: FeedbackRequest, current_user: dict = Depends(get_current_user)):
    """Records whether the user accepted or rejected a recommendation — drives learning."""
    user_id = current_user.get("id", 0)
    behavior_learning.record_feedback(user_id, request.recommendation_id, request.accepted, request.category)
    weak = behavior_learning.get_weak_categories(user_id)
    return {"success": True, "weak_categories": weak}


# ── Simulation ─────────────────────────────────────────────────────

class SimulationRequest(BaseModel):
    trip: dict

class ScenarioRequest(BaseModel):
    scenario: str  # flight_delay | bad_weather | overspending | missed_train | emergency
    trip_context: dict

@router.post("/simulate/trip")
async def simulate_trip(request: SimulationRequest, current_user: dict = Depends(get_current_user)):
    """Simulates an itinerary before travel begins to surface hidden risks."""
    result = await trip_simulator.simulate(request.trip)
    return {"success": True, "data": result}

@router.post("/simulate/scenario")
async def analyze_scenario(request: ScenarioRequest, current_user: dict = Depends(get_current_user)):
    """Generates fallback strategies for common travel disruptions."""
    result = await scenario_engine.analyze(request.scenario, request.trip_context)
    return {"success": True, "data": result}


# ── Global Events ──────────────────────────────────────────────────

@router.get("/events/{city}")
async def get_city_events(city: str, current_user: dict = Depends(get_current_user)):
    """Returns active global events (festivals, disruptions) affecting a city."""
    events = await global_event_engine.get_events_for_city(city)
    return {"success": True, "city": city, "events": events}
