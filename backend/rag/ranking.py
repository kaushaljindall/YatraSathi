from typing import List, Dict, Any, Tuple

class ReRanker:
    def __init__(self):
        pass

    def rank(self, results: List[Tuple[float, Dict[str, Any]]], query_metadata_hints: Dict[str, str] = None) -> List[Dict[str, Any]]:
        """
        Re-ranks vector search results based on semantic score + metadata boosting.
        E.g., if query hint implies 'budget', we slightly boost chunks with budget metadata.
        """
        ranked_results = []
        for score, chunk in results:
            final_score = score
            
            # Simple heuristic ranking adjustment
            if query_metadata_hints:
                meta = chunk.get("metadata", {})
                # Boost if city matches perfectly
                if "city" in query_metadata_hints and query_metadata_hints["city"] == meta.get("city"):
                    final_score += 0.1
                # Boost if category matches
                if "category" in query_metadata_hints and query_metadata_hints["category"] == meta.get("category"):
                    final_score += 0.2
            
            ranked_results.append({
                "score": final_score,
                "chunk": chunk
            })
            
        # Sort descending
        ranked_results.sort(key=lambda x: x["score"], reverse=True)
        return [r["chunk"] for r in ranked_results]

reranker = ReRanker()
