def calculate_confidence(patches):
    results = []
    for patch in patches:

        confidence = 0
        decision = ""

        if "secret" in patch["problem"].lower():
            confidence = 95
            decision = "AUTO_FIX_ALLOWED"

        elif "password" in patch["problem"].lower():
            confidence = 90
            decision = "AUTO_FIX_ALLOWED"

        else:
            confidence = 50
            decision = "HUMAN_ REVIEW_REQUIRED"

        results.append(
            {
                "file": patch["file"],
                "problem": patch["problem"],
                "confidence": confidence,
                "decision": decision
            }
        )

    return results