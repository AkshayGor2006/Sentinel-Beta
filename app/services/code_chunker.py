import os

def read_repository(path: str):
    files = []

    for root, dirs, filenames in os.walk(path):
        for file in filenames:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)

                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                files.append({
                    "file": file,
                    "content": content
                })

    return files

def split_into_chunks(text: str, chunk_size=1000):

    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks

def build_chunks(repo_path):

    print("Inside build_chunks")

    files = read_repository(repo_path)
    print("Files found:", len(files))

    all_chunks = []

    for file in files:

        chunks = split_into_chunks(file["content"])

        for index, chunk in enumerate(chunks):

            all_chunks.append(
                {
                    "file": file["file"],
                    "chunk_number": index,
                    "text": chunk
                }
            )

    print("Total chunks:", len(all_chunks))
    return all_chunks