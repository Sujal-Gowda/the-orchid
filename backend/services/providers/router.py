from typing import TypeVar

from pydantic import BaseModel

from backend.services.providers.gemini import (
    get_fallback_provider,
    get_primary_provider,
)


T = TypeVar("T", bound=BaseModel)


def generate_with_fallback(prompt: str) -> tuple[str, str]:
    """Generate plain text using Primary Gemini, then Fallback Gemini."""

    try:
        primary = get_primary_provider()
        response = primary.generate(prompt)
        return response, "gemini-primary"

    except Exception as primary_error:
        print(f"Primary Gemini failed: {primary_error}")

        try:
            fallback = get_fallback_provider()
            response = fallback.generate(prompt)
            return response, "gemini-fallback"

        except Exception as fallback_error:
            print(f"Fallback Gemini failed: {fallback_error}")
            raise RuntimeError(
                "Both Gemini providers failed"
            ) from fallback_error


def generate_structured_with_fallback(
    prompt: str,
    response_schema: type[T],
) -> tuple[T, str]:
    """Generate a structured response using Primary Gemini, then Fallback Gemini."""

    try:
        primary = get_primary_provider()
        response = primary.generate_structured(
            prompt,
            response_schema,
        )
        return response, "gemini-primary"

    except Exception as primary_error:
        print(f"Primary Gemini structured call failed: {primary_error}")

        try:
            fallback = get_fallback_provider()
            response = fallback.generate_structured(
                prompt,
                response_schema,
            )
            return response, "gemini-fallback"

        except Exception as fallback_error:
            print(f"Fallback Gemini structured call failed: {fallback_error}")
            raise RuntimeError(
                "Both Gemini structured providers failed"
            ) from fallback_error