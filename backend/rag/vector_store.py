import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle
import os
from config.settings import settings

class RAGSystem:
    def __init__(self):
        self.model = SentenceTransformer(settings.EMBEDDINGS_MODEL)
        self.index_path = settings.FAISS_INDEX_PATH
        self.dimension = self.model.get_sentence_embedding_dimension()
        
        # Load or create index
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            # Load chunks mapping (in a real app, this would be in the DB)
            with open(self.index_path + "_chunks.pkl", "rb") as f:
                self.chunks = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.chunks = []
            
    def add_documents(self, documents: list[str]):
        """Embed and add documents to the FAISS index."""
        embeddings = self.model.encode(documents)
        faiss.normalize_L2(embeddings)
        self.index.add(np.array(embeddings).astype('float32'))
        self.chunks.extend(documents)
        
        # Save to disk
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.index_path + "_chunks.pkl", "wb") as f:
            pickle.dump(self.chunks, f)
            
    def retrieve(self, query: str, top_k: int = 3) -> list[str]:
        """Retrieve relevant context for a query."""
        if not self.chunks:
            return []
            
        query_embedding = self.model.encode([query])
        faiss.normalize_L2(query_embedding)
        
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), top_k)
        
        results = []
        for idx in indices[0]:
            if idx != -1 and idx < len(self.chunks):
                results.append(self.chunks[idx])
        return results

rag_system = RAGSystem()
