from typing import List, Dict, Any
from rag.hybrid_search import hybrid_search
from rag.ranking import reranker

class ContextRetriever:
    def retrieve_context(self, query: str, city: str = None, category_hint: str = None, top_k: int = 4) -> str:
        """
        Core retrieval pipeline: Semantic/Hybrid Search -> Re-ranking -> Context Assembly.
        """
        hints = {}
        if city:
            hints["city"] = city.lower()
        if category_hint:
            hints["category"] = category_hint.lower()
            
        # 1. Search
        raw_results = hybrid_search.search(query, city_filter=city, top_k=top_k)
        
        if not raw_results:
            return ""
            
        # 2. Re-rank
        ranked_chunks = reranker.rank(raw_results, query_metadata_hints=hints)
        
        # 3. Context Assembly (Injection Prep)
        # We merge texts, optionally deduplicating similar paragraphs
        assembled_context = "\n\n---\n\n".join([chunk["content"] for chunk in ranked_chunks])
        return assembled_context

retriever = ContextRetriever()
