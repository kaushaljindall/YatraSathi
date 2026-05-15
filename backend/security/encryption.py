import os
import base64
from cryptography.fernet import Fernet
import logging

logger = logging.getLogger(__name__)

class EncryptionService:
    """
    AES-128 (Fernet) symmetric encryption for sensitive fields
    such as voice transcripts, location snapshots, and financial summaries.
    """
    def __init__(self):
        raw_key = os.environ.get("ENCRYPTION_KEY")
        if raw_key:
            self._fernet = Fernet(raw_key.encode())
        else:
            # Auto-generate a key on first run (persist this in production!)
            generated = Fernet.generate_key()
            logger.warning(f"No ENCRYPTION_KEY set. Generated ephemeral key. Set this in .env: {generated.decode()}")
            self._fernet = Fernet(generated)

    def encrypt(self, plaintext: str) -> str:
        return self._fernet.encrypt(plaintext.encode()).decode()

    def decrypt(self, ciphertext: str) -> str:
        return self._fernet.decrypt(ciphertext.encode()).decode()

encryption_service = EncryptionService()
