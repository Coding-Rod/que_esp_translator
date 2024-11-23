# Libraries
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import FileResponse
from app.core.translate import translate_text
import os
import docx

# Models
from app.models.translate_request import TargetLanguage

# Utils
from app.api.utils.file_handler import (
    save_uploaded_file,
    save_document
)

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

        # Read the docx file
        doc = docx.Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        content = "\n".join(full_text)

        # Translate the content
        translated_content = translate_text(content, target_language.value)

        # Save the translated content to a new docx file
        translated_path = save_document(translated_content, file.filename)

        # Clean up and return the translated file
        os.remove(file_path)
        media_type = ("application/vnd.openxmlformats-officedocument"
                      ".wordprocessingml.document")
        return FileResponse(
            translated_path, 
            media_type=media_type,
            filename=f"translated_{file.filename}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")