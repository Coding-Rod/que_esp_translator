from bs4 import BeautifulSoup

from app.models.translate_request import TargetLanguage

def translate_text(text: str, target_language: TargetLanguage) -> str:
    if target_language == "esp":
        return f"Traducción simulada al español: {text}"
    elif target_language == "que":
        return f"Traducción simulada al quechua: {text}"
    else:
        raise ValueError("Unsupported language")

def translate_html(html_content: str, target_language: TargetLanguage) -> str:
    # Parse the HTML content
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Translate only the text content within the body tag, keeping the structure
    body = soup.body
    if body:
        for element in body.find_all(text=True):
            if element.parent.name in ["script", "style"]:
                continue
            if not element.strip():
                continue
            translated_text = translate_text(element.strip(), target_language)
            element.replace_with(translated_text)
    
    # Return the modified HTML as a string
    return str(soup)
