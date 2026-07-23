import os
import ast


def extract_imports(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as f:

        code = f.read()


    tree = ast.parse(code)


    imports = []


    for node in ast.walk(tree):


        if isinstance(node, ast.Import):

            for name in node.names:

                imports.append(
                    name.name
                )


        elif isinstance(node, ast.ImportFrom):

            if node.module:

                imports.append(
                    node.module
                )


    return imports



def build_dependency_graph(repo_path):

    graph = {}


    for root, dirs, files in os.walk(repo_path):


        for file in files:


            if file.endswith(".py"):


                full_path = os.path.join(
                    root,
                    file
                )


                relative_path = os.path.relpath(
                    full_path,
                    repo_path
                )


                try:

                    graph[relative_path] = (
                        extract_imports(full_path)
                    )


                except Exception:

                    graph[relative_path] = []


    return graph