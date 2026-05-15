from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

from auth.dependencies import get_current_user
from config.database import read_db, write_db

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
        
    new_expense = {
        "expense_id": int(time.time()),
        "trip_id": expense.trip_id,
        "category": expense.category,
        "amount": expense.amount,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    db_data["expenses"].append(new_expense)
    await write_db(db_data)
    
    return {"success": True, "expense_id": new_expense["expense_id"]}

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
