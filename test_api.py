
import requests
import json
import uuid
import sqlite3

BASE_URL = "http://localhost:3001/api"

def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    response = requests.post(url, json=payload)
    return response.json()

def create_prompt(token, title, description, text, category, author):
    url = f"{BASE_URL}/prompts"
    headers = {"Authorization": f"Bearer {token}"}
    prompt_id = f"prompt-{uuid.uuid4()}"
    payload = {
        "id": prompt_id,
        "title": title,
        "description": description,
        "text": text,
        "category": category,
        "tags": ["admin-test"],
        "author": author,
        "isPublic": True,
        "isRecommended": False,
        "createdAt": 1752567360,
        "supportedInputs": []
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json(), prompt_id

def update_prompt(token, prompt_id, new_description):
    url = f"{BASE_URL}/prompts/{prompt_id}"
    headers = {"Authorization": f"Bearer {token}"}
    get_response = requests.get(url, headers=headers)
    if get_response.status_code != 200:
        return get_response.json()
    
    prompt_data = get_response.json()
    prompt_data['description'] = new_description

    update_response = requests.put(url, json=prompt_data, headers=headers)
    return update_response.json()

def get_prompt_from_db(prompt_id):
    conn = sqlite3.connect("backend/database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM prompts WHERE id = ?", (prompt_id,))
    row = cursor.fetchone()
    conn.close()
    return row

if __name__ == "__main__":
    # Login as admin
    login_response = login_user("admin@example.com", "adminpassword")
    
    if "token" in login_response:
        token = login_response["token"]
        admin_name = login_response['user']['name']
        print("Admin login successful.")

        # Create a new prompt as admin
        prompt_title = "Admin Test Prompt"
        prompt_desc = "This is an admin test prompt."
        prompt_text = "Admin test."
        prompt_cat = "Admin"
        create_response, new_prompt_id = create_prompt(token, prompt_title, prompt_desc, prompt_text, prompt_cat, admin_name)
        print("Create Prompt Response (Admin):", create_response)
        print("New prompt ID:", new_prompt_id)

        # Verify creation in DB
        created_prompt = get_prompt_from_db(new_prompt_id)
        print("Created Prompt in DB (Admin):", created_prompt)

        # Update the prompt
        new_description = "This is the updated admin description."
        update_response = update_prompt(token, new_prompt_id, new_description)
        print("Update Prompt Response (Admin):", update_response)

        # Verify update in DB
        updated_prompt = get_prompt_from_db(new_prompt_id)
        print("Updated Prompt in DB (Admin):", updated_prompt)

    else:
        print("Admin login failed:", login_response)
