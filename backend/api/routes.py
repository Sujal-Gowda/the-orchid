from fastapi import APIRouter, HTTPException

from backend.models.schemas import AvailabilityRequest, ChatRequest
from backend.services.ai import generate_grounded_answer
from backend.services.availability import check_availability
from backend.services.chat import (
    _is_availability_request,
    _is_hotel_question,
)
from backend.services.retrieval import load_hotel_data, retrieve_hotel_facts


router = APIRouter(prefix="/api")


@router.get("/hotel")
def get_hotel():
    return load_hotel_data()


@router.post("/availability")
def get_availability(request: AvailabilityRequest):
    try:
        return check_availability(
            check_in=request.check_in,
            check_out=request.check_out,
            guests=request.guests,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/chat")
def chat(request: ChatRequest):
    message = request.message.strip()

    if _is_availability_request(message):
        return {
            "type": "availability_form",
            "message": (
                "I can help you check room availability. "
                "Please provide your check-in date, check-out date, "
                "and number of guests."
            ),
            "missing_fields": [
                "check_in",
                "check_out",
                "guests",
            ],
        }

    # Retrieve facts primarily from the current question.
    # This prevents older conversation turns from crowding out
    # the facts needed for the user's latest request.
    facts = retrieve_hotel_facts(message)

    # For short follow-up questions, use recent context only
    # when the current message alone does not retrieve anything.
    if not facts and request.context:
        context_text = " ".join(
            item.content for item in request.context[-6:]
        )
        facts = retrieve_hotel_facts(
            f"{context_text} {message}".strip()
        )

    if not facts:
        if _is_hotel_question(message):
            return {
                "type": "fallback",
                "message": (
                    "I don't have a reliable answer to that from "
                    "The Orchid's approved hotel information. "
                    "I can help with rooms, amenities, dining, "
                    "policies, and availability."
                ),
                "sources": [],
            }

        return {
            "type": "fallback",
            "message": (
                "I'm Simp’AI’otel, The Orchid's guest assistant. "
                "I can help with hotel information, rooms, amenities, "
                "policies, and availability."
            ),
            "sources": [],
        }

    try:
        ai_response, provider = generate_grounded_answer(
            question=message,
            facts=facts,
            context=[
                {
                    "role": item.role,
                    "content": item.content,
                }
                for item in request.context
            ],
        )

        if ai_response.response_type == "fallback":
            return {
                "type": "fallback",
                "message": ai_response.message,
                "sources": [],
            }

        sources = [
            {
                "id": fact["source_id"],
                "label": fact["source_label"],
            }
            for fact in facts
            if fact["source_id"] in ai_response.source_ids
        ]

        return {
            "type": "answer",
            "message": ai_response.message,
            "sources": sources,
            "provider": provider,
            "grounded": True,
        }

    except Exception as exc:
        print(f"AI chat failed: {exc}")

        return {
            "type": "fallback",
            "message": (
                "I'm having trouble generating a response right now. "
                "I can still help with The Orchid's basic hotel "
                "information and availability."
            ),
            "sources": [],
        }