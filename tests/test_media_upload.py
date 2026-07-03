import io
import pytest
from unittest.mock import patch, MagicMock
from app.config.config import Config
from app.utils.exceptions import InvalidMimeTypeError, FileSizeExceededError

@patch("cloudinary.uploader.upload")
def test_upload_success(mock_upload, client, admin_headers):
    """Test successful image upload with valid parameters and admin auth."""
    mock_upload.return_value = {
        "secure_url": "https://res.cloudinary.com/test_cloud/image/upload/v123456789/galxy/products/image.png",
        "public_id": "galxy/products/image",
        "width": 100,
        "height": 100,
        "format": "png"
    }

    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 200
    res_json = response.get_json()
    assert res_json["success"] is True
    assert res_json["data"]["url"] == "https://res.cloudinary.com/test_cloud/image/upload/v123456789/galxy/products/image.png"
    assert res_json["data"]["public_id"] == "galxy/products/image"
    mock_upload.assert_called_once()

@patch("cloudinary.uploader.upload")
def test_upload_success_x_admin_token(mock_upload, client, admin_secret_headers):
    """Test successful image upload using X-Admin-Token header."""
    mock_upload.return_value = {
        "secure_url": "https://res.cloudinary.com/test_cloud/image/upload/v123456789/galxy/general/image.png",
        "public_id": "galxy/general/image",
        "width": 100,
        "height": 100,
        "format": "png"
    }

    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png")
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_secret_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 200
    res_json = response.get_json()
    assert res_json["success"] is True
    assert res_json["data"]["url"] == "https://res.cloudinary.com/test_cloud/image/upload/v123456789/galxy/general/image.png"
    assert res_json["data"]["public_id"] == "galxy/general/image"
    mock_upload.assert_called_once()

def test_upload_missing_file(client, admin_headers):
    """Test response when the file payload is missing."""
    data = {
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 400
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "No file was uploaded" in res_json["message"]

def test_upload_invalid_extension(client, admin_headers):
    """Test upload rejection for disallowed file extensions."""
    data = {
        "file": (io.BytesIO(b"fake text data"), "test.txt"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 400
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "Unsupported file extension" in res_json["message"]

def test_upload_invalid_mime_type(client, admin_headers):
    """Test upload rejection for invalid MIME content type."""
    data = {
        "file": (io.BytesIO(b"fake image data"), "test.png"),
        "folder": "galxy/products"
    }
    # Set an invalid MIME type like text/plain for test.png
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )
    # Since flask test client content_type is for the request, we define content type for the file:
    data = {
        "file": (io.BytesIO(b"fake text"), "test.png", "text/plain"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 400
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "Unsupported MIME type" in res_json["message"]

def test_upload_file_too_large(client, admin_headers):
    """Test file size limit validation."""
    # Build content exceeding MAX_FILE_SIZE_BYTES (5MB)
    large_data = b"0" * (Config.MAX_FILE_SIZE_BYTES + 1024)
    data = {
        "file": (io.BytesIO(large_data), "test.png", "image/png"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 413
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "exceeds" in res_json["message"]

def test_upload_invalid_folder_name(client, admin_headers):
    """Test target folder validation against whitelist."""
    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png", "image/png"),
        "folder": "galxy/unauthorized-folder"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 400
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "is not allowed" in res_json["message"]

@patch("cloudinary.uploader.upload")
def test_cloudinary_upload_failure(mock_upload, client, admin_headers):
    """Test error handling when Cloudinary API consistently fails."""
    mock_upload.side_effect = Exception("Cloudinary connection timed out")

    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png", "image/png"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=admin_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 500
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "Cloudinary upload service failed" in res_json["message"]
    # Should have run all 4 attempts (1 initial + 3 retries)
    assert mock_upload.call_count == 4

@patch("cloudinary.uploader.upload")
def test_cloudinary_upload_success_after_retries(mock_upload, client, admin_headers):
    """Test success after retrying a failed attempt."""
    mock_upload.side_effect = [
        Exception("Timeout"),
        Exception("Temporary Service Failure"),
        {
            "secure_url": "https://res.cloudinary.com/test_cloud/image/upload/v123456789/galxy/products/image.png",
            "public_id": "galxy/products/image",
            "width": 100,
            "height": 100,
            "format": "png"
        }
    ]

    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png", "image/png"),
        "folder": "galxy/products"
    }
    # Temporarily speed up sleep delay in tests by patching time.sleep
    with patch("time.sleep") as mock_sleep:
        response = client.post(
            "/api/admin/media/upload",
            headers=admin_headers,
            data=data,
            content_type="multipart/form-data"
        )

    assert response.status_code == 200
    res_json = response.get_json()
    assert res_json["success"] is True
    assert res_json["data"]["url"] == "https://res.cloudinary.com/test_cloud/image/upload/v123456789/galxy/products/image.png"
    assert mock_upload.call_count == 3
    assert mock_sleep.call_count == 2

def test_upload_unauthorized_request(client, invalid_auth_headers):
    """Test upload rejection when using an invalid bearer token."""
    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png", "image/png"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        headers=invalid_auth_headers,
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 401
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "Unauthorized" in res_json["message"]

def test_upload_missing_authentication(client):
    """Test upload rejection when auth header is missing completely."""
    data = {
        "file": (io.BytesIO(b"fake png data"), "test.png", "image/png"),
        "folder": "galxy/products"
    }
    response = client.post(
        "/api/admin/media/upload",
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 401
    res_json = response.get_json()
    assert res_json["success"] is False
    assert "Unauthorized" in res_json["message"]
