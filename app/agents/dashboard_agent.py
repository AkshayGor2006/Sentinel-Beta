def generate_dashboard(
        security_score,
        security_report,
        threat_report,
        decision,
        roadmap
):
    dashboard = {
        "overview": {
            "security_score": security_score.get("score"),

            "status": security_score.get("status")
        },

        "security_summary": {
            "total_issues": security_report.get("total_issues"),

            "threat_found": len(threat_report)
        },

        "release": {
            "decision": decision.get("decision"),

            "action": decision.get("action")
        },

        "next_steps": roadmap.get("tasks", [])
    }

    return dashboard