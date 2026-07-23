def generate_final_report(
        dashboard,
        executive_report,
        ai_reasoning,
        security_roadmap,
        decision
):
    final_report = {
        "product": "Sentinel AI Security Agent",

        "summary": {
            "security_score": dashboard["overview"]["security_score"],

            "status": dashboard["overview"]["status"]
        },

        "security_overview": executive_report,

        "developer_actions": {
            "priority": security_roadmap.get("priority"),

            "taks": security_roadmap.get("tasks")
        },

        "release_control": {
            "decision": decision.get("decision"),

            "action": decision.get("action")
        },

        "ai_verdict": ai_reasoning
    }

    return final_report