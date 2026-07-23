def generate_fix_plan(issues):

    fixes = []

    for issue in issues:
        plan = []

        if "secret" in issue["issue"].lower():

            plan = {
                "file": issue["file"],
                "action": "move secret into environment variable",

                "steps":
                [
                    "create .env file",
                    "store secret into .env file",
                    "load secret using environment library",
                    "remove secret from source code"
                ]
            }

        elif "password" in issue["issue"].lower():

            plan = {
                "file": issue["file"],
                "action": "replace hardcoded password",

                "steps":
                [
                    "remove password string",
                    "create secure configuration",
                    "read password during runtime"
                ]
            }

        else:

            plan = {
                "file": issue["file"],
                "actiom": "manual review needed",

                "steps": 
                [
                    "Check vulnerable code",

                    "Apply secure coding practices"
                ]
            }

        fixes.append(plan)

    return fixes