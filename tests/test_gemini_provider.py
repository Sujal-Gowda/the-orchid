from dotenv import load_dotenv

from backend.services.providers.gemini import get_fallback_provider


load_dotenv()


def test_gemini_fallback_connection():
    provider = get_fallback_provider()

    response = provider.generate(
        "Reply with exactly: Gemini fallback connection successful"
    )

    assert response
    print(f"\nGemini fallback response: {response}")