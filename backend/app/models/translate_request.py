from pydantic import BaseModel, HttpUrl
from enum import Enum

class TargetLanguage(str, Enum):
    QUECHUA = "que"
    SPANISH = "esp"

class TranslateRequest(BaseModel):
    text: str
    target_language: TargetLanguage

class WebTranslateParams(BaseModel):
    url: str
    target_language: TargetLanguage