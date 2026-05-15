from typing import List, Dict, Any, Tuple
from rag.vector_store import vector_store

class HybridSearch:
    def __init__(self):
        pass
        
    def search(self, query: str, city_filter: str = None, top_k: int = 5) -> List[Tuple[float, Dict[str, Any]]]:
        """
        Performs semantic search, then filters locally by keyword/metadata (Mocking Hybrid behavior).
        In production with a real DB (e.g., Pinecone/Qdrant), metadata filtering happens during vector search.
        """
        # Fetch more to allow filtering without dropping too many
        raw_results = vector_store.search(query, top_k=top_k * 2)
        
        filtered = []
        for score, chunk in raw_results:
            meta = chunk.get("metadata", {})
            if city_filter and meta.get("city") != city_filter.lower():
                continue
            filtered.append((score, chunk))
            
        return filtered[:top_k]

hybrid_search = HybridSearch()
