def calculate_risk(finding):


    score = 0


    issue = finding.get(
        "issue",
        ""
    ).lower()


    file = finding.get(
        "file",
        ""
    ).lower()



    # vulnerability weight

    if "password" in issue:

        score += 7


    if "secret" in issue:

        score += 8


    if "eval" in issue:

        score += 9



    # important files increase risk

    important_files = [

        "auth",
        "login",
        "payment",
        "config",
        "database"

    ]


    for name in important_files:


        if name in file:

            score += 2




    if score >= 10:

        severity = "CRITICAL"

        priority = "Fix Immediately"



    elif score >= 7:


        severity = "HIGH"

        priority = "Fix Soon"



    elif score >= 4:


        severity = "MEDIUM"

        priority = "Review"



    else:


        severity = "LOW"

        priority = "Monitor"



    return {

        "risk_score":
        min(score,10),


        "severity":
        severity,


        "priority":
        priority

    }