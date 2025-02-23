from pydantic import BaseModel, Field
from uuid import UUID, uuid4

class Medicine(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    quantity: int

class Vaccine(Medicine):
    dosage: str

class Pill(Medicine):
    milligrams: int