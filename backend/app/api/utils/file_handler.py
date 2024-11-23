from fastapi import UploadFile
import hashlib
import os
import shutil

def save_uploaded_file(file: UploadFile) -> str:
    # Create a temporary file path
    file_extension = file.filename.split(".")[-1]
    temp_path = f"uploads/{hashlib.md5(file.filename.encode()).hexdigest()}"
    temp_path = f"{temp_path}.{file_extension}"

    # Create the uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)

    # Save the file
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return temp_path