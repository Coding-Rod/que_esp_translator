from fastapi import UploadFile
import hashlib
import os
import shutil
import docx

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

def save_document(translated_content: str, original_filename: str) -> str:
    """ Save the translated content to a new docx file.

    Args:
        translated_content (str): The translated content.
        original_filename (str): The original filename.

    Returns:
        str: The path to the saved translated document.
    """
    os.makedirs("uploads", exist_ok=True)
    translated_doc = docx.Document()
    for line in translated_content.split("\n"):
        translated_doc.add_paragraph(line)

    hash = hashlib.md5(original_filename.encode()).hexdigest()
    translated_path = f"uploads/translated_{hash}.docx"
    translated_doc.save(translated_path)
    return translated_path