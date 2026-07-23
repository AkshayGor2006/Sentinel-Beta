from app.database.connection import SessionLocal
from app.database.models import (
    Repository,
    Scan,
    Vulnerability,
    Report
)


def save_scan(repo_url, query, report):


    db = SessionLocal()

    repository = Repository(
        uri=repo_url,
        name=repo_url.rstrip("/").split("/")[-1]
    )

    db.add(repository)

    db.flush()

    scan = Scan(
        repository_id=repository.id,
        query=query,
        result=report
    )


    db.add(scan)

    db.flush()

    db.add(
        Report(
            scan_id=scan.id,
            summary=f"Total issues: {report.get('total_issues', 0)}"
        )
    )

    for issue in report.get("issues", []):

        db.add(
            Vulnerability(
                scan_id=scan.id,
                file=issue.get("file"),
                issue=issue.get("issue"),
                severity=issue.get("severity")
            )
        )

    db.commit()

    db.refresh(scan)

    db.close()


    return scan



def get_history():


    db = SessionLocal()


    scans = db.query(Scan).all()


    db.close()


    return scans
