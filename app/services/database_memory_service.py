from app.database.models import Scan

def  save_scan_db(db, repository_id, result):
    scan = Scan(
        repository_id=repository_id,
        result= result
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    return scan

def get_user_history_db(db, user_id):

    scans = (
        db.query(Scan)
        .filter(Scan.user_id == user_id)
        .order_by(Scan.created_at)
        .all()
    )

    return scans
