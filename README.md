# GALXY Custom Lighting & Craft Studio
## Module 10 - Shared Media Upload Utility

This module provides a production-ready, highly secure, and optimized **Shared Media Upload Utility** for the GALXY backend. It serves as a unified service layer across other modules (e.g., Module 3 (Products), Module 5 (Reviews), Module 9 (AI Previews)) to handle media validation, sanitization, and uploading directly to **Cloudinary**.

---

## 1. Project Overview
The utility coordinates request-validation policies (checking file presence, folder whitelisting, MIME type compatibility, and size limits) with automated retrying and sanitization mechanisms. It exposes a secure HTTP POST endpoint (`/api/admin/media/upload`) protected by the shared authentication middleware.

---

## 2. Folder Structure
```text
backend sharemedia/
│
├── app/
│   ├── app.py                     # Flask application factory and exception handlers
│   │
│   ├── config/
│   │   └── config.py              # Centralized environment configs and constants
│   │
│   ├── middleware/
│   │   └── auth.py                # Shared require_admin authentication decorator
│   │
│   ├── routes/
│   │   └── media_routes.py        # Blueprint definition & route layer parsing
│   │
│   ├── services/
│   │   └── media_upload_service.py # Core upload logic, retry, and validation loop
│   │
│   └── utils/
│       ├── cloudinary_helper.py   # Cloudinary SDK wrapper and URL parser
│       └── exceptions.py          # Custom domain exceptions mapped to HTTP codes
│
├── tests/
│   ├── conftest.py                # Pytest fixtures and mock configurations
│   └── test_media_upload.py       # Automated suite (15 standard test cases)
│
├── .env.example                   # Local configuration template
├── .gitignore                     # Git ignore file
├── requirements.txt               # Project dependencies
└── postman_collection.json        # Collection for manual endpoints verification
```

---

## 3. Installation & Setup

### Virtual Environment Setup
Ensure you have Python 3.10+ installed.

1. **Clone/Navigate to the directory**:
   ```bash
   cd "backend sharemedia"
   ```

2. **Create a virtual environment**:
   ```bash
   # On Windows
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   ```bash
   # On Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   
   # On Windows (CMD)
   .\venv\Scripts\activate.bat
   
   # On macOS/Linux
   source venv/bin/activate
   ```

### Requirements Installation
Install all required modules and pytest libraries:
```bash
pip install -r requirements.txt
```

---

## 4. Environment Variables Configuration
Create a `.env` file in the root directory based on the `.env.example` file:
```ini
# Flask Configuration
FLASK_APP=app/app.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your_flask_secret_key_here

# MongoDB Atlas Configuration (Optional for media service testing, required for database usage)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=galxy

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

---

## 5. Running the Flask Server
Start the local server using Flask command:
```bash
python app/app.py
```
By default, the server runs on `http://localhost:5000`.

---

## 6. API Endpoint Documentation

### Route Details
* **Authentication**: Authentication is handled by Module 1 (Auth) using the shared `@require_admin` middleware. Access is gated by a valid JWT token signed with the system's `SECRET_KEY` and containing an admin claim.

### Request Form Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `file` | File | **Yes** | Image file to upload (allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`). Maximum size is **5 MB**. |
| `folder` | String | No | Target folder path. Must be whitelisted. Defaults to `galxy/general`. |

### Whitelisted Folders
Only the following folders are permitted destination paths:
* `galxy/products`
* `galxy/categories`
* `galxy/site-content`
* `galxy/reviews`
* `galxy/ai-previews`
* `galxy/general`

---

## 7. Example Request & Response

### Example Multipart Request
Using curl:
```bash
curl -X POST http://localhost:5000/api/admin/media/upload \
  -H "Authorization: Bearer <valid_admin_jwt>" \
  -F "file=@/path/to/my_image.png" \
  -F "folder=galxy/products"
```

### Sample Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your_cloud_name/image/upload/v1683412534/galxy/products/my_image.png",
    "public_id": "galxy/products/my_image"
  }
}
```

---

## 8. Service Function Contract

### Usage of `upload_to_folder()`
Other modules should import and execute the shared service directly:

```python
from app.services.media_upload_service import upload_to_folder

# Returns ONLY the secure URL string
cloudinary_url = upload_to_folder(file_object, "galxy/products")
print(cloudinary_url)
# Output: "https://res.cloudinary.com/..."
```

---

## 9. Error Responses

Every failure follows the standard API schema:
```json
{
  "success": false,
  "message": "<Error details>",
  "errors": ["<ErrorClassOrReason>"]
}
```

### Common HTTP Status Codes
* **400 Bad Request**:
  * Missing file: `"No file was uploaded or file field is missing."`
  * Invalid folder name: `"Folder 'galxy/secret' is not allowed."`
  * Unsupported format/extension: `"Unsupported file extension 'exe'."`
  * Unsupported MIME type: `"Unsupported MIME type 'application/zip'."`
* **401 Unauthorized**:
  * Missing or incorrect auth headers: `"Unauthorized. Admin privileges required."`
* **413 Payload Too Large**:
  * File exceeds 5MB size limit: `"File size (6.10 MB) exceeds the maximum limit of 5 MB."`
* **500 Internal Server Error**:
  * Cloudinary API connection failure or system issues.

---

## 10. Integration Instructions

To integrate the upload utility with other GALXY modules:
1. Ensure the target module imports `upload_to_folder` from `app.services.media_upload_service`.
2. Do not attempt to read key values out of `upload_to_folder` return value. It is a plain string containing the URL.
3. If public ID parsing is required by the module for storage in a local database:
   ```python
   from app.utils.cloudinary_helper import extract_public_id_from_url
   public_id = extract_public_id_from_url(cloudinary_url)
   ```

---

## 11. Automated Testing
Run the comprehensive test suite locally with:
```bash
python -m pytest -v
```

---

## 12. Deployment Notes
* **Environment variables**: Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correctly configured in your staging/production host variables.
* **Payload Size Limits**: Ensure web servers (e.g. Nginx, Gunicorn) are configured to support the 6MB multipart payload limit (`client_max_body_size 6M;` for Nginx).
