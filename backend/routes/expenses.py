from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

from auth.dependencies import get_current_user
from config.database import read_db, write_db
from budget.budget_engine import budget_engine

router = APIRouter()

class ExpenseCreate(BaseModel):
    trip_id: int
    category: str
    amount: float

@router.post("/add")
async def add_expense(
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user)
):
    db_data = await read_db()
    
    # Verify trip belongs to user
    trip = next((t for t in db_data["trips"] if t["trip_id"] == expense.trip_id and t["user_id"] == current_user["id"]), None)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    city = trip.get("destination", "unknown")
    
    # 1. Run AI Financial Analysis
    analysis = await budget_engine.process_new_expense(
        city=city,
        description=expense.category, # We are using category as description in this schema
        amount=expense.amount,
        trip_data=trip
    )
    
    # 2. Save intelligent expense
    new_expense = {
        "expense_id": int(time.time()),
        "trip_id": expense.trip_id,
        "description": expense.category, # Raw user input
        "category": analysis["category"], # AI categorization
        "amount": expense.amount,
        "timestamp": datetime.utcnow().isoformat(),
        "scam_alert": analysis["scam_alert"]["is_suspicious"],
        "pricing_status": analysis["pricing_analysis"]["status"]
    }
    
    db_data["expenses"].append(new_expense)
    await write_db(db_data)
    
    return {
        "success": True, 
        "expense_id": new_expense["expense_id"],
        "analysis": analysis
    }

@router.get("/trip/{trip_id}")
async def get_trip_expenses(
    trip_id: int,
    current_user: dict = Depends(get_current_user)
):
    db_data = await read_db()
    
    # Optional: Verify trip ownership
    trip = next((t for t in db_data["trips"] if t["trip_id"] == trip_id and t["user_id"] == current_user["id"]), None)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    expenses = [e for e in db_data["expenses"] if e["trip_id"] == trip_id]
    return {"success": True, "expenses": expenses}
