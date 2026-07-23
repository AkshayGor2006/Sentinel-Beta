def generate_security_roadmap(security_score):

    score = security_score.get("score", 0)

    if score < 50:
        roadmap = {
            "priority": "URGENT",

            "timeline": "Immediate action required",

            "tasks":
            [
                "fix all CRITICAL vulnerabilities",
                "Remove hardcoded secrets",
                "Review authentication and authorization",
                "Rotate exposed credentials"
            ]
        }

    elif score < 80:

        roadmap = {
            "priority": "MEDIUM",
            "timeline": "Improve before next release",
            "tasks":
            [

                "Fix HIGH severity issues",

                "Improve dependency security",

                "Review risky files"

            ]
        }

    else:
        roadmap = {

            "priority": "LOW",
            "timeline": "Maintain security practices",
            "tasks":
            [

                "Continue monitoring",

                "Keep dependencies updated",

                "Run regular scans"

            ]

        }

    return roadmap

