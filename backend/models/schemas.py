from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator


# -------------------------
# Chat
# -------------------------

class ConversationMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: str = Field(min_length=1, max_length=100)
    context: list[ConversationMessage] = Field(default_factory=list, max_length=10)


class Source(BaseModel):
    id: str
    label: str


class AnswerResponse(BaseModel):
    type: Literal["answer"]
    message: str
    sources: list[Source] = Field(default_factory=list)
    provider: str | None = None
    grounded: bool = True


class ClarificationResponse(BaseModel):
    type: Literal["clarification_needed"]
    message: str
    missing_fields: list[str] = Field(default_factory=list)


class AvailabilityFormResponse(BaseModel):
    type: Literal["availability_form"]
    message: str
    missing_fields: list[str] = Field(default_factory=list)


class FallbackResponse(BaseModel):
    type: Literal["fallback"]
    message: str
    sources: list[Source] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    type: Literal["error"]
    message: str


ChatResponse = (
    AnswerResponse
    | ClarificationResponse
    | AvailabilityFormResponse
    | FallbackResponse
    | ErrorResponse
)


# -------------------------
# Availability
# -------------------------

class AvailabilityRequest(BaseModel):
    check_in: date
    check_out: date
    guests: int = Field(ge=1, le=10)

    @field_validator("check_out")
    @classmethod
    def check_checkout_after_checkin(cls, value: date, info):
        check_in = info.data.get("check_in")

        if check_in and value <= check_in:
            raise ValueError("check_out must be after check_in")

        return value


class AvailabilityCriteria(BaseModel):
    check_in: date
    check_out: date
    guests: int
    nights: int


class RoomResult(BaseModel):
    id: str
    name: str
    capacity: int
    nightly_rate_inr: int
    stay_total_inr: int
    highlights: list[str]
    available: bool


class AvailabilityResponse(BaseModel):
    type: Literal["availability_results"]
    criteria: AvailabilityCriteria
    rooms: list[RoomResult]