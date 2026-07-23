def create_pull_request_plan(patches, confidence):
    pull_requests = []

    for patch, decision in zip(patches, confidence):

        if decision["decision"] == "AUTO_FIX_ALLOWED":
            
            pr = {
                "title": f"Security fix for {patch["file"]}",

                "description": 
                f""" 
                Problem: {patch["problem"]}

                Change: Replace insecure pattern

                {patch.get('old_pattern')}

                with 

                {patch.get("new_pattern")}
                """,

                "status": "READY_FOR_REVIEW"
                
            }

        else:

            pr = {
                "title": 
                f"Manual review required for {patch['file']}",


                "description":

                "AI confidence too low for automatic fix",


                "status":

                "BLOCKED"
            }

        pull_requests.append(pr)

    return pull_requests