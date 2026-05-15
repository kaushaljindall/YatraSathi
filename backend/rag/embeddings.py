from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        self.model_name = settings.EMBEDDINGS_MODEL
        logger.info(f"Loading embedding model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed_query(self, query: str) -> np.ndarray:
        """Generates L2-normalized embedding for a single query."""
        embedding = self.model.encode([query])[0]
        embedding = embedding / np.linalg.norm(embedding)
        return np.array(embedding).astype('float32')

    def embed_batch(self, texts: List[str]) -> np.ndarray:
        """Generates L2-normalized embeddings for a batch of documents."""
        embeddings = self.model.encode(texts)
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        embeddings = embeddings / norms
        return np.array(embeddings).astype('float32')

embedding_service = EmbeddingService()
