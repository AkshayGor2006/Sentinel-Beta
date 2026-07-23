def learn_from_history(history):

    learning = {
        "known_risky_files": [],
        "common_security_mistakes": [],
        "recommendations": ""
    }

    file_counter = {}

    issue_counter = {}

    for scan in history:

        if isinstance(scan, dict):

            report = scan.get(
                "result",
                {}
            )

        else:

            report = scan.result or {}

        issues = report.get("issues", [])

        for issue in issues:

            file  = issue.get("file")

            problem = issue.get("issue")

            if file:

                file_counter[file] = (file_counter.get(file,0) + 1)

            if problem:

                issue_counter[problem] = (issue_counter.get(problem,0) + 1)

    for file, count in file_counter.items():

        if count >= 2:

            learning["known_risky_files"].append(file)

    for issue, count in issue_counter.items():

        if count >= 2:

            learning["common_security_mistakes"].append(issue)

    if learning["known_risky_files"]:

        learning["recommendations"] = ("Focus review on repeated risky files")

    else:

        learning["recommendations"] = ("No repeated pattern found yet")

    return learning
