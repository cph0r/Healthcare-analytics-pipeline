from pathlib import Path


def test_repo_has_readme():
    assert Path("README.md").exists()
