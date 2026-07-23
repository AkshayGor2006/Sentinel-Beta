def manager_agent(user_query):
    query = user_query.lower()

    if(
        "security" in query
        or "vulnerability" in query
        or "jwt" in query
        or "password" in query
    ):
        return {
            "agent": "security_agent",
            "reason": "User wants security analysis"
        }
    
    elif (
        "explain" in query
        or "understand" in query
        or "architecture" in query
    ):
        
        return {

            "agent":
            "code_explainer_agent",

            "reason":
            "User wants code explanation"

        }
    
    elif (
        "slow" in query
        or "performance" in query
        or "optimize" in query
    ):

        return {

            "agent":
            "performance_agent",

            "reason":
            "User wants optimization"

        }
    
    else:

        return {

            "agent":
            "general_agent",

            "reason":
            "No specific intent detected"

        }