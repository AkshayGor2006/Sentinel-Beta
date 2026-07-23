def learn_from_scan(threat_report):

    memory = []

    issue_counter = {}

    for threat in threat_report:

        issue = threat.get(
            "detected_issue",
            "unknown threat"
        )

        issue_counter[issue] = (
            issue_counter.get(issue, 0) + 1
        )

    for issue, count in issue_counter.items():

        memory.append(
            {
                "issue": issue,
                "count": count
            }
        )

    return memory

    
