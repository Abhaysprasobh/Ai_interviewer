import requests

BASE_URL = "http://127.0.0.1:5000"

def test_login_valid_user():
    payload = {
        "email": "testuser@test.com",
        "password": "1234"
    }
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=payload
    )
    assert response.status_code == 200
    assert "token" in response.json()

def test_login_missing_password():
    payload = {
        "email": "testuser@test.com"
    }
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=payload
    )
    assert response.status_code == 400
