def analyze_incidents(history):


    total_scans = len(history)


    repeated_files = {}


    for scan in history:


        report = scan.result or {}


        issues = report.get("issues",[])


        for issue in issues:


            file = issue["file"]


            if file not in repeated_files:


                repeated_files[file] = 1


            else:


                repeated_files[file] += 1



    repeated = []


    for file,count in repeated_files.items():


        if count > 1:


            repeated.append(
                {
                    "file": file,
                    "occurrences": count,
                    "warning":
                    "Repeated security issue detected"
                }
            )



    return {

        "total_previous_scans":

        total_scans,


        "repeated_security_patterns":

        repeated

    }