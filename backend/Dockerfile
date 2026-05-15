# ============================================================
# YatraSaathi Backend — Production Dockerfile
# ============================================================
FROM python:3.10.11-slim

# Set working directory
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for JSON DB and FAISS index
RUN mkdir -p data/faiss_index data/raw data/processed data/embeddings

# Expose port
EXPOSE 8000

# Run with Uvicorn in production mode
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--log-level", "info"]
