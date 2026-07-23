def generate_ai_reasoning(executive_report):

    score = executive_report.get("overall_score")

    status = executive_report.get("security_status")

    decision = executive_report.get("release_decision")

    threats = executive_report.get("main_threats", [])

    reasoning = {
        "summary": "",

        "ai_analysis": "",

        "confidence": "HIGH"
    }

    if status == "HIGH":

        reasoning["summary"] = ("Project contains serious security risks")

        reasoning["ai_analysis"] = (
            f"""
            Security score is {score}.
            
            The system detected {len(threats)} major threats.
            
            Current release decision:
            {decision}

            Immediate security improvements are recommended.
            """
        )

    elif status == "NEEDS_ATTENTION":

        reasoning["summary"] = ("Project security needs improvement")

        reasoning["ai_analysis"] = (
            f"""
            Security score is {score}.

            Some risks exist but project is recoverable.

            Review recommended fixes.
            """
        )

    else:

        reasoning["summary"] = ("Project security looks healthy")

        reasoning["ai_analysis"] = (
            "Continue monitoring and security best practices."
        )

    return reasoning

