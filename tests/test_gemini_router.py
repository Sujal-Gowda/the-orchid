from dotenv import load_dotenv

from backend.services.providers import router


load_dotenv()


def test_gemini_router_falls_back_when_primary_fails(monkeypatch):
    class FailingPrimary:
        def generate(self, prompt: str):
            raise RuntimeError("Simulated primary failure")

    class WorkingFallback:
        def generate(self, prompt: str):
            return "fallback successful"

    monkeypatch.setattr(
        router,
        "get_primary_provider",
        lambda: FailingPrimary(),
    )

    monkeypatch.setattr(
        router,
        "get_fallback_provider",
        lambda: WorkingFallback(),
    )

    response, provider = router.generate_with_fallback(
        "Reply with exactly: fallback successful"
    )

    assert response == "fallback successful"
    assert provider == "gemini-fallback"