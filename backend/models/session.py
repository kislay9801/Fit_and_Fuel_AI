from pydantic import BaseModel, Field
from typing import List, Optional, Literal


VALID_EXERCISES = Literal[
    "squat", "pushup", "deadlift",
    "lunge", "plank", "jumpLanding",
    "highKnees", "sumoSquat", "buttKicks", "pogoJump"
]


class SessionRecord(BaseModel):
    user_id: str = Field(min_length=1, max_length=128)
    exercise: VALID_EXERCISES
    form_score: float = Field(ge=0, le=100)
    reps: int = Field(default=0, ge=0, le=10000)
    issues: List[str] = Field(default_factory=list, max_length=50)
    best_score: Optional[float] = Field(default=None, ge=0, le=100)
    worst_score: Optional[float] = Field(default=None, ge=0, le=100)


class CoachingRequest(BaseModel):
    exercise: VALID_EXERCISES
    avg_form_score: float = Field(ge=0, le=100)
    reps_detected: int = Field(ge=0, le=10000)
    issues_detected: List[str] = Field(default_factory=list, max_length=50)
    best_score: float = Field(ge=0, le=100)
    worst_score: float = Field(ge=0, le=100)


class CoachingResponse(BaseModel):
    summary: str
    exercise: str
    avg_form_score: float

class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    text: str

class AICoachChatRequest(BaseModel):
    message: str
    chat_history: List[ChatMessage] = Field(default_factory=list)
    session_context: List[dict] = Field(default_factory=list)

class AICoachChatResponse(BaseModel):
    reply: str
