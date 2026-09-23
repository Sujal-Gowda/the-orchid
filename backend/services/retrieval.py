import json
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load_json(filename: str) -> dict[str, Any]:
    path = DATA_DIR / filename

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_hotel_data() -> dict[str, Any]:
    return _load_json("hotel.json")


def load_rooms() -> list[dict[str, Any]]:
    data = _load_json("rooms.json")
    return data["rooms"]


def load_inventory() -> dict[str, Any]:
    data = _load_json("inventory.json")
    return data["inventory_rules"]


def _query_terms(query: str) -> set[str]:
    stop_words = {
        "what",
        "is",
        "the",
        "a",
        "an",
        "are",
        "do",
        "does",
        "have",
        "has",
        "can",
        "i",
        "you",
        "your",
        "to",
        "for",
        "of",
        "and",
        "or",
        "in",
        "on",
        "at",
        "it",
        "there",
        "this",
        "that",
        "me",
        "we",
        "with",
        "our",
        "us",
    }

    words = {
        word.strip(".,?!'\"").lower()
        for word in query.split()
    }

    return {
        word
        for word in words
        if len(word) > 2 and word not in stop_words
    }


def _matches(query_terms: set[str], text: str) -> bool:
    searchable_text = text.lower()
    return any(term in searchable_text for term in query_terms)


def retrieve_hotel_facts(query: str) -> list[dict[str, str]]:
    query_terms = _query_terms(query)

    if not query_terms:
        return []

    hotel_data = load_hotel_data()
    results: list[dict[str, str]] = []

    # ---------------------------------------------------------
    # 1. Room information
    # ---------------------------------------------------------
    # Room descriptions are retrieved for general questions
    # about room types and room features.
    #
    # Availability and pricing are intentionally NOT handled
    # here. Those remain deterministic in availability.py.
    # ---------------------------------------------------------
    rooms = load_rooms()

    room_query_terms = {
        "room",
        "rooms",
        "suite",
        "suites",
        "bed",
        "beds",
        "view",
        "size",
        "family",
        "terrace",
        "courtyard",
        "signature",
    }

    if query_terms & room_query_terms:
        room_contents = []

        for room in rooms:
            room_contents.append(
                (
                    f"{room['name']}: "
                    f"capacity {room['capacity']} guests; "
                    f"{room['bed']}; "
                    f"{room['size_sqm']} square metres; "
                    f"{room['view']} view; "
                    f"{'breakfast included' if room['breakfast_included'] else 'breakfast not included'}; "
                    f"{', '.join(room['highlights'])}."
                )
            )

        results.append(
            {
                "source_id": "rooms.accommodation",
                "source_label": "Rooms & accommodation",
                "content": " ".join(room_contents),
            }
        )

    # ---------------------------------------------------------
    # 2. Structured dining information
    # ---------------------------------------------------------
    dining = hotel_data.get("dining", {})

    if isinstance(dining, dict):
        for meal_name, meal in dining.items():
            if not isinstance(meal, dict):
                continue

            searchable_text = " ".join(
                [
                    meal_name,
                    meal.get("location", ""),
                    meal.get("hours", ""),
                    meal.get("description", ""),
                    meal.get("inclusion_note", ""),
                ]
            )

            if _matches(query_terms, searchable_text):
                content_parts = []

                if meal.get("available") is not None:
                    availability = (
                        "Available"
                        if meal["available"]
                        else "Not available"
                    )
                    content_parts.append(availability)

                if meal.get("location"):
                    content_parts.append(
                        f"Location: {meal['location']}."
                    )

                if meal.get("hours"):
                    content_parts.append(
                        f"Hours: {meal['hours']}."
                    )

                if meal.get("description"):
                    content_parts.append(
                        meal["description"]
                    )

                if meal.get("inclusion_note"):
                    content_parts.append(
                        meal["inclusion_note"]
                    )

                results.append(
                    {
                        "source_id": meal["source_id"],
                        "source_label": meal["source_label"],
                        "content": " ".join(content_parts),
                    }
                )

    # ---------------------------------------------------------
    # 3. FAQs
    # ---------------------------------------------------------
    for faq in hotel_data.get("faqs", []):
        searchable_text = (
            f"{faq['question']} "
            f"{faq['answer']}"
        )

        if _matches(query_terms, searchable_text):
            results.append(
                {
                    "source_id": faq["source_id"],
                    "source_label": faq["source_label"],
                    "content": faq["answer"],
                }
            )

    # ---------------------------------------------------------
    # 4. Amenities
    # ---------------------------------------------------------
    for amenity in hotel_data.get("amenities", []):
        searchable_text = (
            f"{amenity['name']} "
            f"{amenity['description']} "
            f"{amenity.get('hours', '')}"
        )

        if _matches(query_terms, searchable_text):
            results.append(
                {
                    "source_id": amenity["source_id"],
                    "source_label": amenity["source_label"],
                    "content": amenity["description"],
                }
            )

    # ---------------------------------------------------------
    # 5. Policies
    # ---------------------------------------------------------
    for policy in hotel_data.get("policies", {}).values():
        searchable_text = policy["summary"]

        if _matches(query_terms, searchable_text):
            results.append(
                {
                    "source_id": policy["source_id"],
                    "source_label": policy["source_label"],
                    "content": policy["summary"],
                }
            )

    # ---------------------------------------------------------
    # Remove duplicate sources while preserving priority order
    # ---------------------------------------------------------
    unique_results: list[dict[str, str]] = []
    seen: set[str] = set()

    for result in results:
        if result["source_id"] not in seen:
            seen.add(result["source_id"])
            unique_results.append(result)

    return unique_results[:5]