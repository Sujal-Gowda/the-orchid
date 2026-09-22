import os
from typing import TypeVar

from google import genai
from pydantic import BaseModel


T = TypeVar("T", bound=BaseModel)


class GeminiProvider:
    def __init__(self, api_key: str, model: str):
        self.client = genai.Client(api_key=api_key)
        self.model = model

    def generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        if not response.text:
            raise RuntimeError("Gemini returned an empty response")

        return response.text

    def generate_structured(
        self,
        prompt: str,
        response_schema: type[T],
    ) -> T:
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": response_schema,
            },
        )

        if not response.text:
            raise RuntimeError("Gemini returned an empty response")

        return response_schema.model_validate_json(response.text)


def get_primary_provider() -> GeminiProvider:
    api_key = os.getenv("GEMINI_API_KEY_PRIMARY")
    model = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY_PRIMARY is not configured")

    return GeminiProvider(api_key=api_key, model=model)


def get_fallback_provider() -> GeminiProvider:
    api_key = os.getenv("GEMINI_API_KEY_FALLBACK")
    model = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY_FALLBACK is not configured")

    return GeminiProvider(api_key=api_key, model=model)