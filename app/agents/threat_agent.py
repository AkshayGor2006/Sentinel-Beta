def analyze_threats(security_report):

    threat_database = {
        "secret": {
            "attack": "Credential theft",
            "severity": "HIGH",
            "description": "Secrets exposed in source code can allow attackers to access systems"
        },

        "password": {
            "attack": "Account Takeover",
            "severity": "HIGH",
            "description": "Hardcoded passwords may allow unauthorized access"
        },

        "token": {
            "attack": "API Abuse",
            "severity": "MEDIUM",
            "description": "Leaked token can be reused by attckers"
        }
    }

    threat_results = []

    issues = security_report.get("issues", [])

    for issue in issues:

        problem = issue.get("issue", "").lower()

        for keyword, data in threat_database.items():

            if keyword in problem:
                threat_results.append({
                    "file": issue.get("file"),
                    "detected_issue": problem,
                    "attack_type": data["attack"],
                    "threat_severity": data["severity"],
                    "explanation": data["description"]
                })

    return threat_results