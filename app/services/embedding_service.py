import hashlib
import math

EMBEDDING_DIMENSION = 384


def create_embedding(text: str):
    """Create a deterministic local embedding so scans do not fail on API quota."""
    vector = [0.0] * EMBEDDING_DIMENSION

    tokens = text.lower().split()

    for token in tokens:
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = int.from_bytes(digest[:4], "big") % EMBEDDING_DIMENSION
        sign = 1.0 if digest[4] % 2 == 0 else -1.0
        vector[index] += sign

    norm = math.sqrt(sum(value * value for value in vector))

    if norm == 0:
        return vector

    return [value / norm for value in vector]
