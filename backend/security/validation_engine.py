import re
from fastapi import HTTPException

class InputValidator:
    """
    Validates and sanitizes user inputs to prevent injection attacks.
    """
    MAX_TEXT_LEN = 2000
    SQL_PATTERNS = re.compile(
        r"(--|;|'|\bDROP\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b)", re.IGNORECASE
    )
    XSS_PATTERNS = re.compile(r"<[^>]*script[^>]*>", re.IGNORECASE)

    def validate_text(self, text: str, field_name: str = "input") -> str:
        if not text or not text.strip():
            raise HTTPException(status_code=422, detail=f"{field_name} cannot be empty.")
        if len(text) > self.MAX_TEXT_LEN:
            raise HTTPException(
                status_code=422,
                detail=f"{field_name} exceeds maximum length of {self.MAX_TEXT_LEN} characters.",
            )
        if self.SQL_PATTERNS.search(text):
            raise HTTPException(status_code=422, detail=f"Invalid characters in {field_name}.")
        if self.XSS_PATTERNS.search(text):
            raise HTTPException(status_code=422, detail=f"HTML/script tags not allowed in {field_name}.")
        return text.strip()

    def validate_budget(self, budget: float) -> float:
        if budget <= 0 or budget > 1_000_000:
            raise HTTPException(status_code=422, detail="Budget must be between 1 and 1,000,000.")
        return budget

validator = InputValidator()
