from pydantic import BaseModel, Field, field_validator
from typing import List
from uuid import UUID, uuid4

class Client(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    animals: List[UUID] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        if not value.strip():
            raise ValueError("Name cannot be empty or just spaces")
        if len(value) < 3:
            raise ValueError("Name must have at least 3 characters")
        return value