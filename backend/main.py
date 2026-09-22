from fastapi import FastAPI

app = FastAPI(
    title="The Orchid — Simp’AI’otel API",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "the-orchid-api",
    }