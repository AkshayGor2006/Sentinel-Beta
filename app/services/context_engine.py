def build_context(results):

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    context = ""

    for document, metadata in zip(documents, metadatas):

        context += f"""
==============================
File: {metadata['file']}
Chunk: {metadata['chunk']}
==============================

{document}


"""

    return context