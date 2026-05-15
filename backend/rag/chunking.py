import re
from typing import List, Dict, Any

class DocumentChunker:
    def __init__(self, chunk_size: int = 500, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def clean_text(self, text: str) -> str:
        """Removes HTML tags, extra whitespace, and noise."""
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def create_chunks(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Splits cleaned text into overlapping semantic chunks with metadata preservation."""
        cleaned = self.clean_text(text)
        words = cleaned.split(' ')
        chunks = []
        
        start = 0
        while start < len(words):
            end = start + self.chunk_size
            chunk_words = words[start:end]
            chunk_text = ' '.join(chunk_words)
            
            chunks.append({
                "content": chunk_text,
                "metadata": metadata
            })
            
            start += (self.chunk_size - self.overlap)
            
        return chunks

chunker = DocumentChunker()
