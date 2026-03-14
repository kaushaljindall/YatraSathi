def get_embedding(text: str):
    """
    Fetch vector embeddings for given text.
    Normally calls OpenAI's text-embedding-ada-002 or HuggingFace.
    """
    # Return mock random vector of dimension 1536
    import numpy as np
    return np.random.rand(1536).tolist()
