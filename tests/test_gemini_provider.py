import os

import pytest
from dotenv import load_dotenv

from backend.services.providers.gemini import get_fallback_provider


load_dotenv()


@pytest.mark.integration
def test_gemini_fallback_connection():
    if not os.getenv("GEMINI_API_KEY_FALLBACK"):
        pytest.skip("GEMINI_API_KEY_FALLBACK is not configured")

    provider = get_fallback_provider()

    response = provider.generate(
        "Reply with exactly: Gemini fallback connection successful"
    )

    assert response
    print(f"\nGemini fallback response: {response}")