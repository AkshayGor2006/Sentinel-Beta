from app.services.risk_engine import calculate_risk
from app.services.ai_summary import generate_ai_summary

def generate_security_report(findings):

    report = {
        "total_issues": len(findings),
        "severity_count": {
            "CRITICAL":0,
            "HIGH":0,
            "MEDIUM":0,
            "LOW":0
        },
        "issues": []
    }

    for finding in findings:

        risk = calculate_risk(
        finding
        )

        severity = risk.get(
            "severity",
            finding.get("severity", "LOW")
        )

        if severity not in report["severity_count"]:
            severity = "LOW"

        report["severity_count"][severity] += 1

        report["issues"].append(
            {

                "file":
                finding.get("file", "unknown"),


                "issue":
                finding.get("issue", "Unknown issue"),


                "risk":
                finding.get("risk", "Risk not provided"),


                "fix":
                finding.get(
                    "recommended_fix",
                    finding.get("fix", "No fix available")
                ),


                "severity":
                severity,


                "risk_score":
                risk["risk_score"],


                "priority":
                risk["priority"]

            }
        )

    report["ai_summary"] = generate_ai_summary(report)

    return report
