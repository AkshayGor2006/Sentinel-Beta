def generate_patch(issues):
    patches = []

    for issue in issues:

        patch = []

        if "secret" in issue["issue"].lower():

            patch = {
                "file": issue["file"],
                "problem": issue["issue"],
                "old_pattern": "secret = 'your_secret'",
                "new_pattern": "secret = os.getenv('SECRET')",
                "required_import": "import os"
            }

        elif "password" in issue["issue"].lower():

            patch = {
                "file": issue["file"],
                "problem": issue["issue"],
                "old_pattern": "password = '123456'",
                "new_pattern": "password = os.getenv('PASSWORD')",
                "required_import": "import os"
            }

        else:

            patch = {
                "file": issue["file"],
                "problem": issue["issue"],
                "message": "automatic patch unavailable"
            }

        patches.append(patch)

    return patches
