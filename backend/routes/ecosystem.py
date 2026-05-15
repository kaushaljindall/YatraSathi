from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
import logging

from auth.dependencies import get_current_user
from multimodal.image_understanding import image_pipeline
from multimodal.vision_engine import vision_engine
from multimodal.ocr_engine import ocr_engine
from autonomous.autonomous_planner import autonomous_planner
from autonomous.autonomous_decision_engine import autonomous_decision_engine
from global_layer.currency_engine import currency_engine
from global_layer.timezone_manager import timezone_manager
from global_layer.regional_adaptation import regional_adaptation
from ecosystem.group_trip_manager import group_manager
from ecosystem.shared_budget_ai import shared_budget_ai
from wearable.smartwatch_support import smartwatch_bridge

router = APIRouter()
logger = logging.getLogger(__name__)


# ── Multimodal ─────────────────────────────────────────────────────

class OCRRequest(BaseModel):
    source_type: str = "menu"  # menu | sign | ticket | receipt
    target_language: str = "en"

@router.post("/multimodal/analyze")
async def analyze_image(
    image: UploadFile = File(...),
    target_language: str = "en",
    source_type: str = "menu",
    current_user: dict = Depends(get_current_user)
):
    """Full multimodal pipeline: OCR + Vision + Translation on a travel image."""
    image_bytes = await image.read()
    result = await image_pipeline.understand(image_bytes, source_type, target_language)
    return {"success": True, "data": result}

@router.post("/ocr/scan")
async def scan_document(
    image: UploadFile = File(...),
    source_type: str = "menu",
    current_user: dict = Depends(get_current_user)
):
    """Extracts text from a travel document (menu, sign, ticket, receipt)."""
    image_bytes = await image.read()
    result = await ocr_engine.extract_text(image_bytes, source_type)
    return {"success": True, "data": result}

@router.post("/vision/understand")
async def analyze_scene(
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Analyses a travel scene: landmark, crowd, safety, photo advice."""
    image_bytes = await image.read()
    result = await vision_engine.analyze_scene(image_bytes)
    return {"success": True, "data": result}


# ── Autonomous AI ──────────────────────────────────────────────────

class AutonomousOptimizeRequest(BaseModel):
    trip: dict
    conditions: dict  # weather, crowd, budget signals

@router.post("/autonomous/optimize")
async def autonomous_optimize(
    request: AutonomousOptimizeRequest,
    current_user: dict = Depends(get_current_user)
):
    """Proactively proposes itinerary improvements. Always requires user confirmation."""
    proposals = await autonomous_planner.propose_optimizations(request.trip, request.conditions)
    return {"success": True, "data": proposals}

@router.post("/autonomous/evaluate")
async def autonomous_evaluate(
    request: AutonomousOptimizeRequest,
    current_user: dict = Depends(get_current_user)
):
    """Evaluates all real-time signals and returns a list of suggested autonomous actions."""
    user_id = current_user.get("id", 0)
    actions = await autonomous_decision_engine.evaluate_and_act(user_id, request.trip, request.conditions)
    return {"success": True, "actions": actions}


# ── Global Intelligence ────────────────────────────────────────────

class CurrencyRequest(BaseModel):
    amount: float
    from_currency: str
    to_currency: str

class TimezoneRequest(BaseModel):
    city: str

@router.post("/currency/convert")
async def convert_currency(request: CurrencyRequest, current_user: dict = Depends(get_current_user)):
    result = await currency_engine.convert(request.amount, request.from_currency, request.to_currency)
    return {"success": True, "data": result}

@router.get("/global/timezone/{city}")
async def get_timezone(city: str, current_user: dict = Depends(get_current_user)):
    tz = timezone_manager.get_city_timezone(city)
    converted = timezone_manager.convert(datetime.utcnow(), tz)
    return {"success": True, "city": city, "data": converted}

@router.get("/global/region/{country}")
async def get_regional_profile(country: str, current_user: dict = Depends(get_current_user)):
    profile = regional_adaptation.get_profile(country)
    tip = regional_adaptation.get_cultural_tip(country)
    return {"success": True, "country": country, "profile": profile, "cultural_tip": tip}


# ── Group Travel ───────────────────────────────────────────────────

class CreateGroupRequest(BaseModel):
    name: str
    member_ids: list[int] = []

class VoteRequest(BaseModel):
    group_id: int
    activity: str
    vote: bool

class SplitRequest(BaseModel):
    total_amount: float
    member_count: int
    split_type: str = "equal"

@router.post("/group/create")
async def create_group(request: CreateGroupRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id", 0)
    group = await group_manager.create_group(user_id, request.name, request.member_ids)
    return {"success": True, "group": group}

@router.get("/group/{group_id}")
async def get_group(group_id: int, current_user: dict = Depends(get_current_user)):
    group = await group_manager.get_group(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"success": True, "group": group}

@router.post("/group/vote")
async def cast_vote(request: VoteRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id", 0)
    result = await group_manager.cast_vote(request.group_id, user_id, request.activity, request.vote)
    return {"success": True, "data": result}

@router.post("/group/split")
async def split_expense(request: SplitRequest, current_user: dict = Depends(get_current_user)):
    result = shared_budget_ai.calculate_split(request.total_amount, request.member_count, request.split_type)
    return {"success": True, "data": result}


# ── Wearable ───────────────────────────────────────────────────────

class WearableNotifyRequest(BaseModel):
    title: str
    body: str
    action_type: str = "info"

@router.post("/wearable/notify")
async def wearable_notify(request: WearableNotifyRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id", 0)
    result = await smartwatch_bridge.send_notification(user_id, request.title, request.body, request.action_type)
    return {"success": True, "data": result}
