from rag.retriever import retriever
from rag.memory import memory

class RAGQueryEngine:
    def process_query(self, user_id: int, query: str, city: str = None) -> dict:
        """
        Orchestrates retrieval and memory injection before sending to AI.
        """
        # 1. Fetch historical context
        history = memory.get_history_context(user_id)
        
        # 2. Retrieve grounded RAG context
        rag_context = retriever.retrieve_context(query, city=city)
        
        # Return structured inputs for the Prompt Layer
        return {
            "query": query,
            "city": city,
            "history_context": history,
            "rag_context": rag_context
        }

query_engine = RAGQueryEngine()
