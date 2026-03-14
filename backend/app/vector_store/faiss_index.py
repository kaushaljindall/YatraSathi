import faiss
import numpy as np

class VectorStore:
    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        # In a real app, read from disk if exists

    def add_texts(self, embeddings: list, ids: list):
        """Add embeddings to FAISS."""
        vectors = np.array(embeddings).astype('float32')
        self.index.add(vectors) # FAISS FlatL2 doesn't store native IDs easily without mapping

    def search(self, query_embedding: list, k: int = 5):
        """Search FAISS index."""
        vector = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(vector, k)
        return distances, indices
