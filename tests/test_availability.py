from datetime import date, timedelta

import pytest

from backend.services.availability import check_availability


def future_date(days: int = 30) -> date:
    return date.today() + timedelta(days=days)


def test_two_guest_stay_returns_capacity_safe_rooms():
    check_in = future_date(30)
    check_out = future_date(32)

    result = check_availability(
        check_in=check_in,
        check_out=check_out,
        guests=2,
    )

    assert result.type == "availability_results"
    assert result.criteria.nights == 2
    assert result.rooms

    assert all(room.capacity >= 2 for room in result.rooms)


def test_three_guest_stay_excludes_two_guest_room():
    check_in = future_date(30)
    check_out = future_date(32)

    result = check_availability(
        check_in=check_in,
        check_out=check_out,
        guests=3,
    )

    room_ids = {room.id for room in result.rooms}

    assert "courtyard-king" not in room_ids
    assert "terrace-suite" in room_ids


def test_price_is_calculated_deterministically():
    check_in = future_date(30)
    check_out = future_date(33)

    result = check_availability(
        check_in=check_in,
        check_out=check_out,
        guests=3,
    )

    terrace = next(
        room
        for room in result.rooms
        if room.id == "terrace-suite"
    )

    assert terrace.nightly_rate_inr == 12900
    assert terrace.stay_total_inr == 38700
    assert result.criteria.nights == 3


def test_checkout_before_checkin_is_rejected():
    check_in = future_date(35)
    check_out = future_date(34)

    with pytest.raises(ValueError):
        check_availability(
            check_in=check_in,
            check_out=check_out,
            guests=2,
        )


def test_past_checkin_is_rejected():
    yesterday = date.today() - timedelta(days=1)
    tomorrow = date.today() + timedelta(days=1)

    with pytest.raises(ValueError):
        check_availability(
            check_in=yesterday,
            check_out=tomorrow,
            guests=2,
        )


def test_blocked_room_dates_are_respected():
    # Terrace Suite is blocked on 2026-10-18 and 2026-10-19.
    result = check_availability(
        check_in=date(2026, 10, 18),
        check_out=date(2026, 10, 20),
        guests=3,
    )

    room_ids = {room.id for room in result.rooms}

    assert "terrace-suite" not in room_ids


def test_no_single_room_for_too_many_guests():
    check_in = future_date(30)
    check_out = future_date(32)

    result = check_availability(
        check_in=check_in,
        check_out=check_out,
        guests=5,
    )

    assert result.rooms == []

def test_stay_longer_than_maximum_is_rejected():
    check_in = future_date(30)
    check_out = future_date(61)

    with pytest.raises(ValueError):
        check_availability(
            check_in=check_in,
            check_out=check_out,
            guests=2,
        )