import requests

BASE_URL = "http://127.0.0.1:5000"

def get_token():
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "interview@test.com", "password": "1234"}
    )
    return response.json()["token"]

def test_start_interview():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "role": "Backend Developer",
        "difficulty": "medium"
    }

    response = requests.post(
        f"{BASE_URL}/api/interview/start",
        json=payload,
        headers=headers
    )

    assert response.status_code == 200
    assert "question" in response.json()

def test_start_interview_invalid_difficulty():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "role": "Backend Developer",
        "difficulty": "expert"
    }

    response = requests.post(
        f"{BASE_URL}/api/interview/start",
        json=payload,
        headers=headers
    )

    assert response.status_code == 400
