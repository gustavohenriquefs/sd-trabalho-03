# controllers/medicines.py
from fastapi import APIRouter, HTTPException
from uuid import UUID
from typing import List

from clinic import clinic
from database import db
from models.medicines import Medicine

router = APIRouter()


@router.post("/", response_model=Medicine)
def add_medicine(medicine: Medicine):
    clinic.add_medicine(medicine)
    return medicine


@router.delete("/{medicine_id}")
def remove_medicine(medicine_id: UUID):
    clinic.remove_medicine(medicine_id)
    return {"message": "Medicine removed successfully"}


# prescribe one unit of medicine to an animal
@router.post("/{medicine_id}/animals/{animal_id}")
def prescribe_medicine(animal_id: UUID, medicine_id: UUID):
    clinic.prescribe_medicine(animal_id, medicine_id, 1)
    return {"message": "Medicine prescribed successfully"}


@router.get("/", response_model=List[Medicine])
def get_stock():
    if not db.stock:
        raise HTTPException(status_code=404, detail="No medicines in stock")
    return list(db.stock.values())
