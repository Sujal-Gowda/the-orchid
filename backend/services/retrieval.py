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
    """
    Normalize a guest question into useful search terms.
    """

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
        "with"
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

    return any(
        term in searchable_text
        for term in query_terms
    )


def retrieve_hotel_facts(query: str) -> list[dict[str, str]]:
    """
    Retrieve approved hotel facts relevant to the guest query.

    Retrieval is deterministic in v1.
    The LLM will receive retrieved facts rather than
    the complete hotel dataset.
    """

    query_terms = _query_terms(query)

    if not query_terms:
        return []

    hotel_data = load_hotel_data()
    results: list[dict[str, str]] = []

    # -------------------------
    # FAQs
    # -------------------------

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

    # -------------------------
    # Amenities
    # -------------------------

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

    # -------------------------
    # Policies
    # -------------------------

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

    # -------------------------
    # Remove duplicates
    # -------------------------

    unique_results: list[dict[str, str]] = []
    seen: set[str] = set()

    for result in results:
        if result["source_id"] not in seen:
            seen.add(result["source_id"])
            unique_results.append(result)

    return unique_results[:5]