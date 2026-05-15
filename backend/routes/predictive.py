from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import logging

from auth.dependencies import get_current_user
from predictive.crowd_prediction import crowd_predictor
from predictive.pricing_forecast import pricing_forecaster
from predictive.weather_prediction import weather_predictor
from predictive.travel_pattern_ai import travel_pattern_ai
from scaling.cache_manager import cache

router = APIRouter()
logger = logging.getLogger(__name__)

class CrowdRequest(BaseModel):
    location: str
    hour: int
    month: int = datetime.utcnow().month

class PricingForecastRequest(BaseModel):
    category: str
    base_price: float
    days_ahead: int = 1

class WeatherForecastRequest(BaseModel):
    city: str
    days_ahead: int = 1

@router.post("/predict/crowd")
async def predict_crowd(request: CrowdRequest, current_user: dict = Depends(get_current_user)):
    cache_key = cache.make_key("crowd", request.location, str(request.hour))
    cached = await cache.get(cache_key)
    if cached:
        return {"success": True, "cached": True, "data": cached}

    result = crowd_predictor.predict(request.location, request.hour, request.month)
    await cache.set(cache_key, result, ttl_seconds=1800)
    return {"success": True, "cached": False, "data": result}

@router.post("/predict/pricing")
async def predict_pricing(request: PricingForecastRequest, current_user: dict = Depends(get_current_user)):
    result = pricing_forecaster.forecast(request.category, request.base_price, request.days_ahead)
    return {"success": True, "data": result}

@router.post("/predict/weather")
async def predict_weather(request: WeatherForecastRequest, current_user: dict = Depends(get_current_user)):
    cache_key = cache.make_key("weather_forecast", request.city, str(request.days_ahead))
    cached = await cache.get(cache_key)
    if cached:
        return {"success": True, "cached": True, "data": cached}

    result = await weather_predictor.forecast_risk(request.city, request.days_ahead)
    await cache.set(cache_key, result, ttl_seconds=3600)
    return {"success": True, "cached": False, "data": result}

@router.get("/metrics/summary")
async def get_metrics(current_user: dict = Depends(get_current_user)):
    from monitoring.metrics import metrics
    return {"success": True, "metrics": metrics.get_summary()}
