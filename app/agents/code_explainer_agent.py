def explain_codebase(code_analysis):
    total_files = len(code_analysis)

    technologies = set()

    important_files = []

    for file in code_analysis:

        for imp in file["imports"]:
            technologies.add(imp)

        if(len(file["functions"]) > 0 or len(file["classes"]) > 0):
            important_files.append(
                {
                    "file": file["file"],
                    "functions": file["functions"],
                    "classes": file["classes"]
                }
            )

    return{
        "summary": f"This project contains {total_files}python files",
        "technologies": list(technologies),
        "important_files": important_files[:10]
    }