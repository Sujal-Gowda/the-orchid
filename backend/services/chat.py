from backend.models.schemas import (
    AnswerResponse,
    AvailabilityFormResponse,
    FallbackResponse,
)
from backend.services.retrieval import retrieve_hotel_facts


AVAILABILITY_TERMS = {
    "available",
    "availability",
    "book",
    "booking",
    "reserve",
    "reservation",
}

STAY_TERMS = {
    "stay",
    "staying",
    "night",
    "nights",
}

ROOM_TERMS = {
    "room",
    "rooms",
}

HOTEL_SCOPE_TERMS = {
    "hotel",
    "room",
    "rooms",
    "breakfast",
    "pool",
    "parking",
    "wifi",
    "gym",
    "fitness",
    "spa",
    "restaurant",
    "check-in",
    "checkin",
    "check-out",
    "checkout",
    "cancellation",
    "pet",
    "pets",
    "smoking",
    "children",
    "airport",
    "transfer",
}


def _contains_term(message: str, terms: set[str]) -> bool:
    text = message.lower()
    return any(term in text for term in terms)


def _is_availability_request(message: str) -> bool:
    text = message.lower()

    # Explicit availability language.
    if _contains_term(text, AVAILABILITY_TERMS):
        return True

    # A room/stay request combined with stay-related language.
    has_room = _contains_term(text, ROOM_TERMS)
    has_stay = _contains_term(text, STAY_TERMS)

    if has_room and has_stay:
        return True

    # Common natural-language requests.
    availability_phrases = {
        "check availability",
        "check available rooms",
        "find a room",
        "find rooms",
        "looking for a room",
        "need a room",
        "want a room",
        "looking to stay",
        "want to stay",
    }

    return any(phrase in text for phrase in availability_phrases)


def _is_hotel_question(message: str) -> bool:
    return _contains_term(message, HOTEL_SCOPE_TERMS)


def handle_chat(message: str):
    if _is_availability_request(message):
        return AvailabilityFormResponse(
            type="availability_form",
            message=(
                "I can help you check room availability. "
                "Please provide your check-in date, "
                "check-out date, and number of guests."
            ),
            missing_fields=[
                "check_in",
                "check_out",
                "guests",
            ],
        )

    facts = retrieve_hotel_facts(message)

    if facts:
        sources = [
            {
                "id": fact["source_id"],
                "label": fact["source_label"],
            }
            for fact in facts
        ]

        answer = " ".join(
            fact["content"] for fact in facts
        )

        return AnswerResponse(
            type="answer",
            message=answer,
            sources=sources,
            provider="deterministic",
            grounded=True,
        )

    if _is_hotel_question(message):
        return FallbackResponse(
            type="fallback",
            message=(
                "I don't have a reliable answer to that from "
                "The Orchid's approved hotel information. "
                "I can help with rooms, amenities, dining, "
                "policies, and availability."
            ),
        )

    return FallbackResponse(
        type="fallback",
        message=(
            "I'm Simp’AI’otel, The Orchid's guest assistant. "
            "I can help with hotel information, rooms, amenities, "
            "policies, and availability."
        ),
    )