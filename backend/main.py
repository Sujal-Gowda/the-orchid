from dotenv import load_dotenv
from fastapi import FastAPI

from backend.api.routes import router


load_dotenv()


app = FastAPI(
    title="The Orchid — Simp’AI’otel API",
    version="0.1.0",
)

app.include_router(router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "the-orchid-api",
    }