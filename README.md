# MeneNet - Strong Identity System

This project is a modern **Strong Identity Management System** built with:

- Python (Flask)
- PostgreSQL
- Docker
- JWT Authentication
- AI-ready Biometric Layer (planned)
- React.js frontend (planned)

---

## ✅ Current Architecture

- Backend: Flask REST API
- Database: PostgreSQL (Dockerized)
- Authentication: OAuth2 / JWT (Password-based login)
- Identity Model: Users, Family Relationships, Addresses, Photos, Biometrics
- Storage: Local image storage + ready for cloud (AWS S3 planned)
- AI: FaceNet & Fingerprint recognition layer (in progress)

---

## ✅ Implemented Endpoints

### Authentication

- `POST /auth/register` → Register password
- `POST /auth/login` → Login → returns JWT token

### Users

- `POST /users/register` → Register user (auto-generates national_id)
- `POST /users/generate_id` → Generate national_id (format: REGION-DDMMYY-UNIQUE)
- `GET /users/search/{national_id}` → Search user by national_id
- `GET /users/{user_id}` → Get user profile
- `GET /users` → List all users

### Family Relationships

- `POST /users/link_family` → Link two users as family members
- `GET /relationships/{user_id}` → List family relationships of user

### Addresses

- `POST /addresses` → Add address
- `GET /addresses/{user_id}` → Get addresses of user
- `PUT /addresses/{address_id}` → Update address
- `DELETE /addresses/{address_id}` → Delete address

### Photos

- `POST /photos/upload` → Upload profile photo
- `GET /photos/{user_id}` → Retrieve latest profile photo URL

### Biometrics

- `POST /biometrics` → Upload facial and fingerprint data (AI layer coming soon)

---

## 🗺 Roadmap Progress

| Phase                           | Status   |
|---------------------------------|----------|
| Setup & Environment             | ✅ Done  |
| Backend Core Functionality      | ✅ Done  |
| Database Schema Setup           | ✅ Done  |
| API Development & Testing       | ✅ In progress (Postman collection being prepared) |
| Image Processing & AI Integration| ⬜ Next  |
| Frontend (React.js)             | ⬜ Planned |
| Deployment & Scaling            | ⬜ Planned |
| Future Enhancements             | ⬜ Planned |

---

## 🛠 How to Run

### 1️⃣ Clone the repo:

```bash
git clone https://github.com/yourusername/menenet.git
cd menenet

2️⃣ Setup virtualenv:

python3 -m venv venv
source venv/bin/activate

3️⃣ Install dependencies:

pip install -r backend/requirements.txt

4️⃣ Run database migrations:

python3 backend/database/models.py

5️⃣ Run Flask backend:

python3 -m backend.api.routes

6️⃣ Test API:

👉 Import Postman collection (coming soon).
👉 Use http://localhost:5000 for API base URL.

✨ Next Steps (Planned)
	•	Finalize Postman collection
	•	Implement AI face recognition using FaceNet
	•	Implement AI fingerprint matching
	•	Build React.js frontend
	•	Setup deployment (Docker Compose, Nginx, HTTPS)
	•	Add full unit tests
	•	Add API versioning and docs (Swagger)

📚 Documentation
	•	Full API docs → In progress → /docs/api_documentation.md
	•	System architecture → /docs/system_architecture.md
