def simulate_attack(threat_report):
    simulations = []

    for threat in threat_report:
        attack_type = threat.get("attack_type", "")

        if attack_type == "Credential theft":

            simulations.append({
                "file": threat.get("file"),
                "attack_scenario": [
                    "Attacker finds exposed secret in source code",
                    "Attacker uses secret to authenticate",
                    "Unauthorized access is gained"
                ],

                "business_impact": "Sensitive systems or used data may be compromised",

                "recommended_priority": "Immediate remediation required"
            })

        elif attack_type == "Account Takeover":

            simulations.append({
                "file": threat.get("file"),

                "attack_scenario": [
                    "Attacker obtains hardcoded credentials",

                    "Attacker logs in as valid user",

                    "Account privileges are abused"
                ],

                "business_impact": "User or admin account compromise",
                "recommended_priority": "High priority fix"
            })

        else:
            simulations.append({
                "file": threat.get("file"),

                "attack_scenario": [
                    "Potential explanation possible"
                ],

                "business_impact": "Needs further investigation",
                "recommended_priority": "Review required"
            })

    return simulations