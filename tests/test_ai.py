from dotenv import load_dotenv

from backend.services.ai import generate_grounded_answer


load_dotenv()


def test_grounded_ai_answer():
    facts = [
        {
            "source_id": "amenity_pool",
            "source_label": "Pool",
            "content": "The rooftop pool is open daily from 7:00 AM to 9:00 PM.",
        }
    ]

    response, provider = generate_grounded_answer(
        question="Does the hotel have a pool?",
        facts=facts,
        context=[],
    )

    assert response.response_type == "answer"
    assert response.message
    assert response.source_ids == ["amenity_pool"]
    assert provider in {"gemini-primary", "gemini-fallback"}

    print(f"\nProvider: {provider}")
    print(f"Message: {response.message}")
    print(f"Sources: {response.source_ids}")