from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import HTMLResponse
import requests

from app.core.translate import translate_html
from app.models.translate_request import WebTranslateParams

router = APIRouter()

@router.get("/translate/{url:path}/{target_language}")
async def translate_web(params: WebTranslateParams = Depends()):
    """ Translate the HTML content of a webpage from a given URL to the target language.
    Args:
        url (str): The URL of the webpage to be translated.
        target_language (str): The target language for translation.
    Returns:
        HTMLResponse: The translated HTML content as an HTTP response.
    Raises:
        HTTPException: If there is an error fetching the webpage or translating the content.
    """

    try:
        # Fetch the HTML content from the provided URL
        response = requests.get(params.url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)

        print(response.text)

        # Get the HTML content and translate it
        html_content = response.text
        translated_html = translate_html(html_content, params.target_language)

        # Return the translated HTML as a response
        return HTMLResponse(content=translated_html)

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch the webpage: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Translation error: {str(e)}")
