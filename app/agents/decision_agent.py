def make_decision(threat_report):

    critical = 0
    high = 0 

    for threat in threat_report:

        severity = threat.get("threat_severity", "")

        if severity == "CRITICAL":
            critical += 1

        elif severity == "HIGH":
            high += 1

    if critical > 0:

        return {
            "decision": "BLOCK_RELEASE",
            "reason": "Critical threats detected",
            "action": "Fix immediately before deployment"
        }
    
    elif high > 0:
        return {
            "decision": "SECURITY_REVIEW_REQUIRED",
            "reason": "High risk vulnerabilities found",
            "action": "Review before production"
        }
    
    else:
        return {
            "decision": "APPROVED",
            "reason": "No dangerous threats detected",
            "action": "Safe to continue"
        }