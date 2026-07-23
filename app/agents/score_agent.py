def calculate_security_score(report):
    score = 100

    issues = report.get("issues", [])

    for issue in issues:

        severity = issue.get("severity", "")

        if severity == "CRITICAL":
            score -= 30

        elif severity == "HIGH":
            score -= 20

        elif severity == "MEDIUM":
            score -= 10

        elif severity == "LOW":
            score -= 5

    if score < 0:
        score = 0

    if score >= 80:
        status = "HEALTHY"

    elif score >= 50:
        status = "NEEDS_ATTENTION"

    else:
        status = "RISKY"

    return {
        "score": score,
        "status": status
    }
