import os

from app.services.fix_generator import generate_fix


SECURITY_RULES = {
    "eval(": {
        "issue": "Unsafe eval usage",
        "risk": "User controlled input can execute malicious code",
        "fix": "Avoid eval. Use safer parsing methods",
        "severity": "CRITICAL"
    },
    "exec(": {
        "issue": "Unsafe exec usage",
        "risk": "Dynamic code execution vulnerability",
        "fix": "Remove exec usage",
        "severity": "CRITICAL"
    },
    "password =": {
        "issue": "Hardcoded password",
        "risk": "Credentials can leak through source code",
        "fix": "Use environment variables",
        "severity": "HIGH"
    },
    "secret": {
        "issue": "Possible secret exposure",
        "risk": "Application secrets may be leaked",
        "fix": "Move secrets to secure storage",
        "severity": "HIGH"
    }
}


def build_code_sample(code, pattern, max_chars=2500):
    lowered = code.lower()
    index = lowered.find(pattern)

    if index == -1:
        return code[:max_chars]

    start = max(index - 700, 0)
    end = min(index + 1800, len(code))
    return code[start:end]


def scan_security(repo_path):
    findings = []
    fix_cache = {}

    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if not file.endswith(".py"):
                continue

            path = os.path.join(root, file)

            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                original_code = f.read()

            lowered_code = original_code.lower()

            for pattern, details in SECURITY_RULES.items():
                if pattern not in lowered_code:
                    continue

                cache_key = f"{details['issue']}:{pattern}"

                if cache_key not in fix_cache:
                    code_sample = build_code_sample(
                        original_code,
                        pattern
                    )

                    ai_fix = generate_fix(
                        details["issue"],
                        code_sample
                    )

                    if ai_fix.startswith("Gemini request failed:"):
                        ai_fix = details["fix"]

                    fix_cache[cache_key] = ai_fix

                findings.append(
                    {
                        "file": path,
                        "detected_pattern": pattern,
                        "issue": details["issue"],
                        "risk": details["risk"],
                        "recommended_fix": fix_cache[cache_key],
                        "severity": details["severity"]
                    }
                )

    return findings
