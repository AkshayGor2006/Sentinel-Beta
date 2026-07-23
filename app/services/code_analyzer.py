import ast   #Abstract Syntax Tree.
import os


def analyze_python_file(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as file:

        source_code = file.read()


    tree = ast.parse(source_code)


    result = {

        "file": file_path,

        "imports": [],

        "functions": [],

        "classes": []

    }


    for node in ast.walk(tree):


        # functions

        if isinstance(
            node,
            ast.FunctionDef
        ):

            result["functions"].append(
                node.name
            )


        # classes

        elif isinstance(
            node,
            ast.ClassDef
        ):

            result["classes"].append(
                node.name
            )


        # imports

        elif isinstance(
            node,
            ast.Import
        ):

            for item in node.names:

                result["imports"].append(
                    item.name
                )


        elif isinstance(
            node,
            ast.ImportFrom
        ):

            result["imports"].append(
                node.module
            )


    return result

def analyze_repository(repo_path):

    analysis = []


    for root, dirs, files in os.walk(repo_path):


        for file in files:


            if file.endswith(".py"):

                full_path = os.path.join(
                    root,
                    file
                )


                try:

                    analysis.append(
                        analyze_python_file(
                            full_path
                        )
                    )


                except Exception:

                    pass


    return analysis