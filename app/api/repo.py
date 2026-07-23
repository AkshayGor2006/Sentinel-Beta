from fastapi import APIRouter
from app.schemas.repo_schema import RepoRequest
from app.services.code_analyzer import analyze_repository

from fastapi import Depends
from app.core.security import verify_token

from app.services.github_service import clone_repository
from app.services.dependency_graph import build_dependency_graph

from sqlalchemy.orm import Session
from app.database.connection import get_db

from app.agents.manager_agent import manager_agent
from app.agents.code_explainer_agent import explain_codebase
from app.agents.security_agent import scan_security
from app.services.report_generator import generate_security_report
from app.agents.progress_agent import compare_scans
from app.agents.recommendation_agent import generate_recommendations
from app.agents.fix_agent import generate_fix_plan
from app.agents.patch_agent import generate_patch
from app.agents.confidence_agent import calculate_confidence
from app.agents.pull_request_agent import create_pull_request_plan
from app.agents.approval_agent import review_changes
from app.agents.incident_agent import analyze_incidents
from app.services.memory_service import get_history
from app.agents.learning_agent import learn_from_history
from app.agents.threat_agent import analyze_threats
from app.agents.attack_agent import simulate_attack
from app.agents.decision_agent import make_decision
from app.agents.learning_memory_agent import learn_from_scan
from app.agents.score_agent import calculate_security_score
from app.agents.roadmap_agent import generate_security_roadmap
from app.agents.executive_report_agent import generate_executive_report
from app.agents.dashboard_agent import generate_dashboard
from app.agents.ai_reasoning_agent import generate_ai_reasoning
from app.agents.sentinel_agent import generate_final_report
from app.services.database_memory_service import (
    get_user_history_db
)
from app.database.models import (
    User,
    Repository,
    Scan,
    Vulnerability,
    Report
)
from app.services.code_chunker import read_repository
from app.services.code_chunker import build_chunks
from app.services.vector_store import store_chunks
from app.services.semantic_search import search_code
from app.services.context_engine import build_context
from app.services.ai_service import ask_ai
from pydantic import BaseModel
from app.services.repository_chat import chat_with_repository


router = APIRouter()

class RepoChatRequest(BaseModel):
    question: str


def run_repository_scan(
    repo_url: str,
    query: str,
    current_user_id: int,
    db: Session
):

#github_service.py --------------
    repo_path = clone_repository(
        repo_url
    )

    if repo_path is None:

        return {
            "error":
            "Repository not found or invalid GitHub URL"
        }

    chunks = build_chunks(repo_path)

    store_chunks(chunks)

    results = search_code(query)

    context = build_context(results)

    answer = ask_ai(
        context,
        query
    )


    repo = Repository(
        uri=repo_url,
        name=repo_url.split("/")[-1].replace(".git", ""),
        user_id=current_user_id
    )


    db.add(repo)
    db.commit()
    db.refresh(repo)


    analysis = analyze_repository(
        repo_path
    )

    selected_agent = manager_agent(
        query
    )


    agent_result = None
    progress = {}
    recommendations = []
    fix_plan = {}
    patches = []
    confidence = {}
    pull_request = {}
    approval = {}
    incident_report = {}
    learning_report = {}
    threat_report = []
    attack_simulation = []
    decision = {}
    learning_memory = []
    security_score = {}
    security_roadmap = {}
    executive_report = {}
    dashboard = {}
    ai_reasoning = {}
    sentinel_report = {}


    if selected_agent["agent"] == "code_explainer_agent":

        agent_result = explain_codebase(
            analysis
        )


    if selected_agent["agent"] == "security_agent":


        findings = scan_security(
            repo_path
        )


        agent_result = generate_security_report(
            findings
        )


        recommendations = generate_recommendations(
            agent_result["issues"]
        )


        fix_plan = generate_fix_plan(
            agent_result["issues"]
        )


        patches = generate_patch(
            agent_result["issues"]
        )


        confidence = calculate_confidence(
            patches
        )


        pull_request = create_pull_request_plan(
            patches,
            confidence
        )


        approval = review_changes(
            pull_request
        )


        threat_report = analyze_threats(
            agent_result
        )


        attack_simulation = simulate_attack(
            threat_report
        )


        decision = make_decision(
            threat_report
        )


        learning_memory = learn_from_scan(
            threat_report
        )


        security_score = calculate_security_score(
            agent_result
        )


        security_roadmap = generate_security_roadmap(
            security_score
        )


        executive_report = generate_executive_report(
            security_score,
            decision,
            threat_report,
            security_roadmap
        )


        ai_reasoning = generate_ai_reasoning(
            executive_report
        )


        dashboard = generate_dashboard(
            security_score,
            agent_result,
            threat_report,
            decision,
            security_roadmap
        )


        sentinel_report = generate_final_report(
            dashboard,
            executive_report,
            ai_reasoning,
            security_roadmap,
            decision
        )


        # DAY 37 DATABASE SAVE

        scan = Scan(
            repository_id=repo.id,
            query=query,
            result=agent_result,
            user_id=current_user_id
        )


        db.add(scan)
        db.commit()
        db.refresh(scan)


        for issue in agent_result.get(
            "issues",
            []
        ):

            vulnerability = Vulnerability(

                scan_id=scan.id,

                file=issue.get(
                    "file"
                ),

                issue=issue.get(
                    "issue"
                ),

                severity=issue.get(
                    "severity",
                    "MEDIUM"
                )

            )


            db.add(
                vulnerability
            )

        report = Report(

            scan_id=scan.id,

            summary=str(
                sentinel_report
            )

        )


        db.add(
            report
        )

        db.commit()



        history = get_user_history_db(
            db,
            current_user_id
        )


        incident_report = analyze_incidents(
            history
        )


        learning_report = learn_from_history(
            history
        )


        progress = compare_scans(
            history
        )


    return {

        "selected_agent": selected_agent,

        "agent_result": agent_result,

        "ai_summary": agent_result.get("ai_summary", ""),

        "context": context,

        "answer": answer,

        "progress": progress,

        "recommendations": recommendations,

        "fix_plan": fix_plan,

        "patches": patches,

        "confidence": confidence,

        "pull_request": pull_request,

        "approval": approval,

        "incident_report": incident_report,

        "learning_report": learning_report,

        "threat_report": threat_report,

        "attack_simulation": attack_simulation,

        "decision": decision,

        "learning_memory": learning_memory,

        "security_score": security_score,

        "security_roadmap": security_roadmap,

        "executive_report": executive_report,

        "dashboard": dashboard,

        "ai_reasoning": ai_reasoning,

        "sentinel_report": sentinel_report
    }


@router.post("/analyze-repo")
def analyze_repo(
    request: RepoRequest,
    user_id:int = Depends(verify_token),
    db: Session = Depends(get_db)
):

    current_user_id = user_id

    if not isinstance(
        current_user_id,
        int
    ):

        user = db.query(User).filter(
            User.username == current_user_id
        ).first()

        if user is None:

            return {
                "error":
                "Invalid or expired user token"
            }

        current_user_id = user.id

    return run_repository_scan(
        request.url,
        request.query,
        current_user_id,
        db
    )

@router.post("/chat-with-repo")
def chat_with_repo(request: RepoChatRequest):

    response = chat_with_repository(
        request.question
    )

    return response