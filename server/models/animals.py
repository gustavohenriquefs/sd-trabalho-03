from pydantic import BaseModel, Field
from typing import Literal
from uuid import uuid4, UUID


class Animal(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    age: int
    type: Literal["dog", "cat", "rabbit"]
    owner_id: UUID
    medicines: dict[UUID, int] = Field(default_factory=dict)


class Dog(Animal):
    type: Literal["dog"] = "dog"
    breed: str


class Cat(Animal):
    type: Literal["cat"] = "cat"
    color: str


class Rabbit(Animal):
    type: Literal["rabbit"] = "rabbit"
    weight: float
