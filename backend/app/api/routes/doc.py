from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import FileResponse
from app.core.translate import translate_text
import os
import chardet

from app.api.utils.file_handler import save_uploaded_file
from app.models.translate_request import TargetLanguage

router = APIRouter()

@router.post("/")
async def translate_document(file: UploadFile = File(...),
                             target_language: TargetLanguage = Form(...)):
    """ Translate the content of a document to the target language.

    Args:
        file (UploadFile, optional): The document to translate. 
            Defaults to File(...).
        target_language (TargetLanguage, optional): The target language for the 
            translation. Can be either "esp" or "que". Defaults to Form(...).

    Raises:
        HTTPException: Error processing document.

    Returns:
        FileResponse: The translated document.
    """
    try:
        file_path = save_uploaded_file(file)

        # Detect the file encoding
        with open(file_path, "rb") as f:
            raw_data = f.read()
            detected = chardet.detect(raw_data)
            encoding = detected.get("encoding", "utf-8")  # Default to UTF-8

        # Read the file using the detected encoding
        with open(file_path, "r", encoding=encoding) as f:
            content = f.read()

        # Translate the content
        translated_content = translate_text(content, target_language.value)

        # Save the translated file
        translated_path = f"translated_{file.filename}"
        with open(translated_path, "w", encoding="utf-8") as f:
            f.write(translated_content)

        # Clean up and return the translated file
        os.remove(file_path)
        return FileResponse(translated_path, media_type="text/plain", filename=f"translated_{file.filename}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
