from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import text, doc, web

app = FastAPI(
    title="Spanish-Quechua Translator",
    description="API for translating text, documents, and web pages between Spanish and Quechua.",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(text.router, prefix="/translate-text", tags=["Text Translation"])
app.include_router(doc.router, prefix="/translate-document", tags=["Document Translation"])
app.include_router(web.router, prefix="/translate-web", tags=["Web Translation"])
