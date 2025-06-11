MeneNet Identity System

A modern, secure, modular Digital Identity Registration System.

🚀 Current MVP features:

✅ Identity Registration → Full SPA

✅ User Info → First Name, Last Name, DOB, Gender, Region

✅ Profile Photo Upload → automatic

✅ Address Management → Add Address during registration

✅ Family Relationships → bi-directional → clickable

✅ Profile View → clean cards + collapsible

✅ Search Users → by Name / National ID

✅ Pagination → with profile photo

✅ Profile Photo displayed → in User List

✅ Download Identity Card → Driver’s License style PDF → separate microservice

✅ Card Generator Microservice → clean architecture

✅ QR Code → in Card → with verification link

✅ Issuing Authority + Signature → in Card

✅ Professional layout → modern look and feel.

---
## Project strcture
MeneNet/
├── backend/               → Identity REST API (Flask) , Python 

├── frontend/              → SPA (ReactJS + Bootstrap)

├── card-generator/        → Card Generator Microservice (Flask + ReportLab + QRCode)

└── README.md              → Project description


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

	👉  Postman

 Frontend SPA:
 	cd frontend
   	npm install
	npm start
Runs : http://localhost:3000

## Card Generator Microservice

	cd card-generator
	pip install -r requirements.txt
	python3 app.py
Run on:
	http://localhost:6000

Notes

✅ Full architecture → ready to scale → modular → follows best practices.
✅ SPA → professional UX → inspired by modern identity systems.
✅ Card Generator → clean independent microservice → can be improved further.
✅ Database → PostgreSQL → already prepared → users, addresses, photos, family_relationships.

⸻

Next Steps

🚧 Production Deployment Prep:
✅ Dockerize Card Generator
✅ Secure CORS config
✅ Add simple Auth for Card Generator API (JWT / token)
✅ Optional → verify QR Code points to SPA verify page.

🚧 Final SPA Polish:
✅ Further improve styling
✅ Add “Back to Users” on Profile
✅ Role-based Permissions (Admin vs Normal User).

Author

Haileslassei Lilay Desalegn
