# GALXY CMS & Site Content Backend (Module 10)

> [!IMPORTANT]
> **INTEGRATION ARCHITECTURE & SCAFFOLDING NOTICE (Finding B):**
> This repository is delivered with standalone running and testing files (`run.py`, `config.py`, `app/__init__.py`, `app/db.py`) to serve as a development and automated review test harness.
> When integrating this module into the shared multi-module GALXY team backend alongside Modules 1–9, the blueprints (`public_bp` and `admin_bp` inside `app/routes/`) should be registered on the team's shared Flask app factory, and the DB handle inside `app/services/site_content_service.py` should import the shared DB handle instead of our standalone `app.db`. The duplicate scaffolding files (`run.py`, `config.py`, `app/__init__.py`, `app/db.py`) must be deleted or archived at merge time.

This is the standalone backend service for **Module 10 (Site Content / CMS)** of the GALXY Custom Lighting & Craft Studio application. It implements the data layer, content validator, service operations, and the public and admin REST API endpoints.

---

## 1. Project Directory Structure
```text
app/
 ├── models/
 │    └── site_content.py            # MongoDB collection index registrations
 ├── routes/
 │    ├── site_content_routes.py     # Public content API endpoints (single & bulk GET)
 │    └── admin_site_content_routes.py # Admin CMS management API endpoints (GET & PUT)
 ├── services/
 │    └── site_content_service.py    # Service layer (CRUD) for database operations
 ├── utils/
 │    └── content_schema_validator.py # Strict CMS content schemas and URL/phone/email validators
 └── __init__.py                     # Flask application factory
scripts/
 └── seed_site_content.py            # Idempotent defaults seeder for all 6 sections
tests/
 └── test_site_content.py            # Test suite (13 unit/integration tests)
config.py                            # Settings configuration loader
run.py                               # App entry point
requirements.txt                     # Project dependencies list
.env.example                         # Environment template keys
```

---

## 2. Environment Setup & Configuration

### A. Environment Variables (.env)
Create a `.env` file in the project root folder. The following keys are required:

```ini
FLASK_APP=run.py
FLASK_ENV=development
FLASK_RUN_PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-address>/?appName=galxy-cluster
MONGO_DB_NAME=galxy

# Cloudinary Configuration (Only stored; uploader belongs to Member 2)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT secret (from Module 1 for admin authentication verification)
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration origin list (defaults to * if unset)
CORS_ALLOWED_ORIGINS=*
```

*Note: Make sure your public outbound IP is whitelisted on the MongoDB Atlas Console (or configured to allow access from anywhere `0.0.0.0/0` during development).*

### B. Installing Dependencies
Initialize a virtual environment and install the required dependencies:
```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.\.venv\Scripts\activate

# Install required packages
pip install -r requirements.txt
pip install setuptools<70
pip install certifi
```

---

## 3. Database Seeding (Critical First Step)
To ensure that public GET routes do not 404 in production, you must seed the database with compliant default content before integrating with the frontend. Run the idempotent seeder script:
```powershell
python scripts/seed_site_content.py
```
This script will:
1. Establish connection to your MongoDB Atlas cluster.
2. Wire constraints and create a `unique` index on the `section` field in the `site_content` collection.
3. Validate and insert default documents for all 6 sections (`hero`, `about`, `footer`, `contact`, `seo_home`, `social_links`).

---

## 4. Running the Application and Tests

### Run local server:
```powershell
python run.py
```
The server will start on `http://127.0.0.1:5000/`.

### Run automated tests:
```powershell
pytest -v
```
This runs 13 automated tests mocking the MongoDB connection in-memory (`mongomock`) and validating API behaviors.

---

## 5. Handoff Contract for Members 3 & 4 (Frontend Integration)

### Envelope Response Standard
All JSON responses from this module strictly follow your project-wide contract format:

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": { ... }
}
```

#### Error Response (400/404/401/403/500)
```json
{
  "success": false,
  "message": "Error details",
  "errors": {
    "field_name": "Validation reason"
  }
}
```

### Endpoints Implemented

#### 1. Public Content APIs
* **GET `/api/site-content/<section>`**
  Retrieves a single homepage section.
  * *Allowed sections*: `hero`, `about`, `footer`, `contact`, `seo_home`, `social_links`
* **GET `/api/site-content?sections=hero,footer,social_links`** (Bulk GET)
  Retrieves multiple sections in a single call.

#### 2. Admin CMS APIs (Requires Admin JWT Token)
All routes require passing `Authorization: Bearer <JWT_TOKEN>` in the headers (role claim must be `'admin'` or `'super_admin'`).
* **GET `/api/admin/site-content/<section>`**
  Same as public fetch.
* **PUT `/api/admin/site-content/<section>`**
  Overwrites the section content. Perform a full replace of the `content` key.
  * *Request Body Shape*:
    ```json
    {
      "content": { ... section shape fields ... }
    }
    ```
  * *Relaxed URL validator*: As an extension, `cta_link` inside the `hero` section schema supports root-relative internal links (e.g. `/shop`, `/products/lighting`) as well as absolute URLs.