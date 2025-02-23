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


@router.post("/prescribe/{medicine_id}")
def prescribe_medicine(medicine_id: UUID):
    clinic.prescribe_medicine(medicine_id)
    return {"message": "Medicine prescribed successfully"}


@router.get("/", response_model=List[Medicine])
def get_stock():
    if not db.stock:
        raise HTTPException(
            status_code=404, detail="No medicines in stock"
        )  # ✅ Correct way
    return list(db.stock.values())
