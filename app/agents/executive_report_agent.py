def generate_executive_report(
        security_score,
        decision,
        threat_report,
        security_roadmap
):


    report = {


        "security_status":

        security_score.get(
            "status"
        ),



        "overall_score":

        security_score.get(
            "score"
        ),



        "release_decision":

        decision.get(
            "decision"
        ),



        "main_threats":

        [],

        "recommended_actions":

        security_roadmap.get(
            "tasks",
            []
        )

    }

    for threat in threat_report:


        report["main_threats"].append(

            {

            "attack":

            threat.get(
                "attack_type"
            ),


            "severity":

            threat.get(
                "threat_severity"
            )

            }

        )

    return report