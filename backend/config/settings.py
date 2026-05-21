from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "YatraSaathi API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # JWT Authentication
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # External APIs
    GROQ_API_KEY: str
    GROQ_API_KEY_TRANSLATION: Optional[str] = None
    GROQ_API_KEY_PLANNER: Optional[str] = None
    GROQ_API_KEY_INSIGHTS: Optional[str] = None
    OPENWEATHERMAP_API_KEY: Optional[str] = None

    # RAG Settings
    FAISS_INDEX_PATH: str = "./data/faiss_index.bin"
    EMBEDDINGS_MODEL: str = "all-MiniLM-L6-v2"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
