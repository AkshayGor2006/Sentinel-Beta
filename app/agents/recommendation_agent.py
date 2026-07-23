def generate_recommendations(issues):
    recommendations = []
    for issue in issues:

        fix_steps = []

        if "secret" in issue["issue"].lower():

            fix_steps = [

                "Remove hardcoded secrets from code",

                "Store secrets using environment variables",

                "Rotate exposed credentials"

            ]

        elif "password" in issue["issue"].lower():

            fix_steps = [
                "Remove password from source code",

                "Use secure authentication methods",

                "Store credentials safely"
            ]

        else:
            fix_steps = [
                "Review the vulnerable code",

                "Apply security best practices"
            ]

        recommendations.append(
            {
                "file": issue["file"],
                "problem": issue["issue"],
                "severity": issue["severity"],
                "fix_steps": fix_steps
            }
        )

    return recommendations