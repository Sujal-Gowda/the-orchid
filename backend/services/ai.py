from typing import Literal

from pydantic import BaseModel, Field

from backend.services.providers.router import (
    generate_structured_with_fallback,
)


class GroundedAIResponse(BaseModel):
    message: str = Field(min_length=1)
    source_ids: list[str] = Field(default_factory=list)
    response_type: Literal["answer", "fallback"] = "answer"


def generate_grounded_answer(
    question: str,
    facts: list[dict[str, str]],
    context: list[dict[str, str]] | None = None,
) -> tuple[GroundedAIResponse, str]:
    if not facts:
        return (
            GroundedAIResponse(
                message="I don't have enough approved information to answer that reliably.",
                source_ids=[],
                response_type="fallback",
            ),
            "deterministic",
        )

    fact_text = "\n".join(
        f"- [{fact['source_id']}] {fact['content']}"
        for fact in facts
    )

    context_text = ""

    if context:
        context_text = "\n".join(
            f"{item['role']}: {item['content']}"
            for item in context[-6:]
        )

    prompt = f"""
You are Simp’AI’otel, the guest assistant for The Orchid.

Answer the guest's question using ONLY the approved hotel facts below.

Rules:
- Do not invent hotel information.
- Do not make assumptions about policies, facilities, prices, dates, availability, or services.
- Do not calculate room prices or availability.
- Keep the answer concise and natural.
- The approved hotel facts are authoritative.
- If an approved fact directly answers the guest's question, answer from that fact.
- Never say that information is unavailable when the approved facts contain the answer.
- Do not ask the guest to contact the front desk when the approved facts provide the answer.
- If the facts genuinely do not support an answer, use response_type "fallback".
- source_ids must contain ONLY source IDs from the approved facts.
- If response_type is "fallback", source_ids must be empty.

Approved hotel facts:
{fact_text}

Recent conversation:
{context_text or "No previous conversation."}

Guest question:
{question}
"""

    try:
        response, provider = generate_structured_with_fallback(
            prompt,
            GroundedAIResponse,
        )
    except RuntimeError:
        return (
            GroundedAIResponse(
                message="I’m having trouble generating a response right now. I can still help with The Orchid's basic hotel information and availability.",
                source_ids=[],
                response_type="fallback",
            ),
            "deterministic",
        )

    valid_source_ids = {
        fact["source_id"]
        for fact in facts
    }

    invalid_source_ids = [
        source_id
        for source_id in response.source_ids
        if source_id not in valid_source_ids
    ]

    if invalid_source_ids:
        raise ValueError(
            f"Gemini returned invalid source IDs: {invalid_source_ids}"
        )

    return response, provider