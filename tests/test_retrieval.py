from backend.services.retrieval import retrieve_hotel_facts


def test_pool_question_returns_pool_source():
    results = retrieve_hotel_facts("Does the hotel have a swimming pool?")

    assert results
    assert any(
        result["source_id"] == "policy.pool-hours"
        for result in results
    )


def test_breakfast_question_returns_breakfast_source():
    results = retrieve_hotel_facts("Is breakfast included?")

    assert results
    assert any(
        result["source_id"] == "policy.breakfast"
        for result in results
    )


def test_cancellation_question_returns_cancellation_source():
    results = retrieve_hotel_facts("What is the cancellation policy?")

    assert results
    assert any(
        result["source_id"] == "policy.cancellation"
        for result in results
    )