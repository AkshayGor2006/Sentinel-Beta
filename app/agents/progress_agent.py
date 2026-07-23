def compare_scans(history):


    if len(history) < 2:

        return {

            "message":
            "Not enough scan history",

            "progress":
            None

        }



    old_scan = history[-2]

    new_scan = history[-1]



    old_issues = old_scan.result["total_issues"]

    new_issues = new_scan.result["total_issues"]



    fixed = old_issues - new_issues



    if fixed > 0:

        status = "Security improved"


    elif fixed < 0:

        status = "Security got worse"


    else:

        status = "No security change"



    return {


        "previous_issues":
        old_issues,


        "current_issues":
        new_issues,


        "difference":
        fixed,


        "status":
        status

    }
