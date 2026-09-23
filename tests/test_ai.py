from dotenv import load_dotenv

from backend.services.ai import generate_grounded_answer
from backend.services.providers import router


load_dotenv()


POOL_FACTS = [
    {
        "source_id": "amenity_pool",
        "source_label": "Pool",
        "content": "The rooftop pool is open daily from 7:00 AM to 9:00 PM.",
    }
]


def test_grounded_ai_answer():
    response, provider = generate_grounded_answer(
        question="Does the hotel have a pool?",
        facts=POOL_FACTS,
        context=[],
    )

    assert response.response_type == "answer"
    assert response.message
    assert response.source_ids == ["amenity_pool"]
    assert provider in {"gemini-primary", "gemini-fallback"}

    print(f"\nProvider: {provider}")
    print(f"Message: {response.message}")
    print(f"Sources: {response.source_ids}")


def test_primary_failure_uses_fallback(monkeypatch):
    class FakePrimary:
        def generate_structured(self, prompt, response_schema):
            raise RuntimeError("Primary quota exhausted")

    class FakeFallback:
        def generate_structured(self, prompt, response_schema):
            return response_schema(
                message="The rooftop pool is open daily from 7:00 AM to 9:00 PM.",
                source_ids=["amenity_pool"],
                response_type="answer",
            )

    monkeypatch.setattr(
        router,
        "get_primary_provider",
        lambda: FakePrimary(),
    )
    monkeypatch.setattr(
        router,
        "get_fallback_provider",
        lambda: FakeFallback(),
    )

    response, provider = generate_grounded_answer(
        question="Does the hotel have a pool?",
        facts=POOL_FACTS,
        context=[],
    )

    assert provider == "gemini-fallback"
    assert response.response_type == "answer"
    assert response.source_ids == ["amenity_pool"]


def test_both_gemini_providers_fail(monkeypatch):
    class FailingProvider:
        def generate_structured(self, prompt, response_schema):
            raise RuntimeError("Gemini unavailable")

    monkeypatch.setattr(
        router,
        "get_primary_provider",
        lambda: FailingProvider(),
    )
    monkeypatch.setattr(
        router,
        "get_fallback_provider",
        lambda: FailingProvider(),
    )

    response, provider = generate_grounded_answer(
        question="Does the hotel have a pool?",
        facts=POOL_FACTS,
        context=[],
    )

    assert provider == "deterministic"
    assert response.response_type == "fallback"
    assert response.source_ids == []
    assert response.message