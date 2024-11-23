from fastapi import FastAPI
from app.api.routes import text, doc, web

app = FastAPI(
    title="Spanish-Quechua Translator",
    description="API for translating text, documents, and web pages between Spanish and Quechua.",
    version="1.0.0",
)

# Include routers
app.include_router(text.router, prefix="/translate-text", tags=["Text Translation"])
app.include_router(doc.router, prefix="/translate-document", tags=["Document Translation"])
app.include_router(web.router, prefix="/translate-web", tags=["Web Translation"])
