import logging
from typing import List, Dict, Any
from rag.chunking import chunker
from rag.vector_store import vector_store

logger = logging.getLogger(__name__)

class DataIngestionPipeline:
    def __init__(self):
        pass

    def ingest_raw_data(self, source_text: str, city: str, category: str):
        """
        Cleans, chunks, and stores raw travel data.
        Category examples: 'food', 'scams', 'transport', 'hotels'
        """
        metadata = {
            "city": city.lower(),
            "category": category.lower(),
            "source": "manual_ingestion"
        }
        
        chunks = chunker.create_chunks(source_text, metadata)
        if chunks:
            vector_store.add_documents(chunks)
            logger.info(f"Ingested {len(chunks)} chunks for {city} [{category}]")
        else:
            logger.warning("No chunks generated for ingestion.")

ingestion_pipeline = DataIngestionPipeline()
