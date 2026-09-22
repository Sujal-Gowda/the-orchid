from datetime import date, timedelta

from backend.models.schemas import (
    AvailabilityCriteria,
    AvailabilityResponse,
    RoomResult,
)
from backend.services.retrieval import load_inventory, load_rooms


MAX_STAY_NIGHTS = 30


def _calculate_nights(check_in: date, check_out: date) -> int:
    return (check_out - check_in).days


def _stay_dates(check_in: date, check_out: date) -> list[date]:
    """
    Return every occupied night.

    Check-out itself is not an occupied night.
    Example:
        Oct 12 -> Oct 14
        occupied nights = Oct 12, Oct 13
    """
    nights = _calculate_nights(check_in, check_out)

    return [
        check_in + timedelta(days=index)
        for index in range(nights)
    ]


def _room_available(
    room_id: str,
    check_in: date,
    check_out: date,
) -> bool:
    inventory = load_inventory()

    room_inventory = inventory.get(room_id)

    if room_inventory is None:
        return False

    blocked_dates = {
        date.fromisoformat(value)
        for value in room_inventory.get("blocked_dates", [])
    }

    occupied_dates = _stay_dates(check_in, check_out)

    return not any(
        stay_date in blocked_dates
        for stay_date in occupied_dates
    )


def check_availability(
    check_in: date,
    check_out: date,
    guests: int,
) -> AvailabilityResponse:
    """
    Deterministically calculate room availability.

    No LLM is involved in:
    - date validation
    - capacity validation
    - inventory checks
    - night calculation
    - price calculation
    """

    today = date.today()

    if check_in < today:
        raise ValueError("check_in cannot be in the past")

    if check_out <= check_in:
        raise ValueError("check_out must be after check_in")

    nights = _calculate_nights(check_in, check_out)

    if nights > MAX_STAY_NIGHTS:
        raise ValueError(
            f"stay cannot exceed {MAX_STAY_NIGHTS} nights"
        )

    if guests < 1:
        raise ValueError("guests must be at least 1")

    if guests > 10:
        raise ValueError("guest count cannot exceed 10")

    rooms = load_rooms()

    results: list[RoomResult] = []

    for room in rooms:
        # Capacity is deterministic.
        if room["capacity"] < guests:
            continue

        # Inventory is deterministic.
        if not _room_available(
            room["id"],
            check_in,
            check_out,
        ):
            continue

        nightly_rate = room["nightly_rate_inr"]
        stay_total = nightly_rate * nights

        results.append(
            RoomResult(
                id=room["id"],
                name=room["name"],
                capacity=room["capacity"],
                bed=room["bed"],
                size_sqm=room["size_sqm"],
                view=room["view"],
                nightly_rate_inr=nightly_rate,
                stay_total_inr=stay_total,
                breakfast_included=room["breakfast_included"],
                highlights=room["highlights"],
                image=room["image"],
                available=True,
            )
        )

    return AvailabilityResponse(
        type="availability_results",
        criteria=AvailabilityCriteria(
            check_in=check_in,
            check_out=check_out,
            guests=guests,
            nights=nights,
        ),
        rooms=results,
    )