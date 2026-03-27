"""
Service: embeddings
Generates and stores vector embeddings for document chunks (RAG pipeline).
TODO: implement with a vector DB (e.g., ChromaDB, Pinecone) and an embedding model.
"""


async def embed_document(document_id: str, pages: list[dict]) -> None:
    """Chunk document pages and store vector embeddings.

    Args:
        document_id: ID of the document.
        pages: List of page dicts with keys: pageNumber, content.

    Raises:
        NotImplementedError: Stub — not yet implemented.
    """
    # TODO: implement chunking + embedding
    #   1. Split each page into overlapping chunks (~512 tokens)
    #   2. Generate embeddings via Gemini embedding model or sentence-transformers
    #   3. Store in vector DB keyed by document_id + chunk_index
    raise NotImplementedError("embeddings.embed_document is not yet implemented.")


async def search_similar(document_id: str, query: str, top_k: int = 5) -> list[dict]:
    """Retrieve the most relevant document chunks for a query.

    Args:
        document_id: Scope search to this document.
        query: The search query text.
        top_k: Number of results to return.

    Returns:
        list of dicts with keys: page (int), content (str), score (float).

    Raises:
        NotImplementedError: Stub — not yet implemented.
    """
    raise NotImplementedError("embeddings.search_similar is not yet implemented.")
