from dotenv import load_dotenv

from backend.services.providers import router


load_dotenv()


def test_gemini_router_falls_back_when_primary_fails():
    class FailingPrimary:
        def generate(self, prompt: str):
            raise RuntimeError("Simulated primary failure")

    original_primary = router.get_primary_provider
    router.get_primary_provider = lambda: FailingPrimary()

    try:
        response, provider = router.generate_with_fallback(
            "Reply with exactly: fallback successful"
        )

        assert response
        assert provider == "gemini-fallback"

        print(f"\nProvider used: {provider}")
        print(f"Response: {response}")

    finally:
        router.get_primary_provider = original_primary