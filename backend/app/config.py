import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration settings."""
    app_name: str = "YatraSathi API"
    debug: bool = True
    
    # Redis
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI Keys
    groq_api_key: str = os.getenv("GROQ_API_KEY", "your-groq-api-key")

    class Config:
        env_file = ".env"

settings = Settings()
