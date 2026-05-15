from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
import time

from config.database import read_db, write_db
from schemas.user import UserCreate, UserResponse, Token
from auth.security import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    db_data = await read_db()
    
    # Check if user exists
    if any(u["email"] == user_in.email or u["username"] == user_in.username for u in db_data["users"]):
        raise HTTPException(status_code=400, detail="Email or username already registered")
        
    new_user = {
        "id": int(time.time()),
        "username": user_in.username,
        "email": user_in.email,
        "hashed_password": get_password_hash(user_in.password),
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    
    db_data["users"].append(new_user)
    await write_db(db_data)
    
    return new_user

@router.post("/login", response_model=Token)
async def login(user_in: UserCreate):
    db_data = await read_db()
    user = next((u for u in db_data["users"] if u["email"] == user_in.email), None)
    
    if not user or not verify_password(user_in.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        
    access_token = create_access_token(subject=user["id"])
    return {"access_token": access_token, "token_type": "bearer"}
