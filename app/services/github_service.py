import git
import tempfile


def clone_repository(repo_url):

    temp_dir = tempfile.mkdtemp()


    try:

        git.Repo.clone_from(
            repo_url,
            temp_dir
        )

        return temp_dir


    except Exception:

        return None