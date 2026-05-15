import faiss
import numpy as np
import pickle
import os
import logging
from typing import List, Dict, Any, Tuple
from rag.embeddings import embedding_service
from config.settings import settings

logger = logging.getLogger(__name__)

class FAISSStore:
    def __init__(self, index_path: str = settings.FAISS_INDEX_PATH):
        self.index_path = index_path
        self.metadata_path = index_path + "_metadata.pkl"
        self.dimension = embedding_service.dimension
        
        # In-memory mapping of vectors to metadata
        self.metadata_store: List[Dict[str, Any]] = []
        
        self._load_or_create_index()

    def _load_or_create_index(self):
        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.metadata_path, "rb") as f:
                self.metadata_store = pickle.load(f)
            logger.info(f"Loaded FAISS index with {self.index.ntotal} vectors.")
        else:
            self.index = faiss.IndexFlatIP(self.dimension) # Inner product since vectors are normalized (Cosine Sim)
            self.metadata_store = []
            os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
            logger.info("Initialized new FAISS index.")

    def add_documents(self, documents: List[Dict[str, Any]]):
        """Adds embedded chunks with metadata to the index."""
        if not documents:
            return
            
        texts = [doc["content"] for doc in documents]
        embeddings = embedding_service.embed_batch(texts)
        
        self.index.add(embeddings)
        self.metadata_store.extend(documents)
        self.save_index()

    def search(self, query: str, top_k: int = 5) -> List[Tuple[float, Dict[str, Any]]]:
        """Performs semantic search and returns (score, chunk_metadata)."""
        if self.index.ntotal == 0:
            return []
            
        query_embedding = embedding_service.embed_query(query).reshape(1, -1)
        distances, indices = self.index.search(query_embedding, top_k)
        
        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx != -1 and idx < len(self.metadata_store):
                results.append((float(distances[0][i]), self.metadata_store[idx]))
                
        return results

    def save_index(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.metadata_store, f)

vector_store = FAISSStore()
