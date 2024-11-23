from fastapi import APIRouter, HTTPException
from app.core.translate import translate_text
from app.models.translate_request import TranslateRequest

router = APIRouter()

@router.post("/")
async def translate_text_endpoint(request: TranslateRequest):
    """ Translate text from one language to another.
    Args:
        request (TranslateRequest): The request object containing the text to be translated and the target language.
    Returns:
        dict: A dictionary containing the original text and the translated text.
    Raises:
        HTTPException: If there is a ValueError during translation, an HTTP 400 error is raised with the error details.
    """

    try:
        translated_text = translate_text(request.text, request.target_language)
        return {"original_text": request.text, "translated_text": translated_text}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
