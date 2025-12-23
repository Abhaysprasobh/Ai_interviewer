import requests

BASE_URL = "http://127.0.0.1:5000"

def get_token():
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "speech@test.com", "password": "1234"}
    )
    return response.json()["token"]

def test_speech_recognition():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    with open("sample.wav", "rb") as audio:
        files = {"audio": audio}
        response = requests.post(
            f"{BASE_URL}/api/speech/recognize",
            headers=headers,
            files=files
        )

    assert response.status_code == 200
    assert "text" in response.json()
