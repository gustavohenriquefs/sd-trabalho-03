from fastapi import HTTPException
from uuid import UUID

from database import db, Database
from models.medicines import Medicine
class Clinic:
    def __init__(self, database: Database):
        self.db = database

    def get_medicine(self, medicine_id: UUID):
        if medicine_id in self.db.stock:
            return self.db.stock[medicine_id]
        else:
            raise HTTPException(status_code=404, detail="Medicine not found")

    def add_medicine(self, medicine: Medicine):
        if medicine.id in self.db.stock:
            self.db.stock[medicine.id].quantity += medicine.quantity
        else:
            self.db.stock[medicine.id] = medicine

    def remove_medicine(self, medicine_id: UUID):
        if medicine_id in self.db.stock:
            del self.db.stock[medicine_id]
        else:
            raise HTTPException(status_code=404, detail="Medicine not found")

    def prescribe_medicine(self, animal_id: UUID, medicine_id: UUID, quantity: int):
        print(
            "Prescribing medicine: \n id: ",
            animal_id,
            "medicine_id: ",
            medicine_id,
            "quantity: ",
            quantity,
        )
        if medicine_id in self.db.stock:
            if self.db.stock[medicine_id].quantity < quantity:
                raise HTTPException(status_code=400, detail="Not enough stock")

            self.db.stock[medicine_id].quantity -= quantity

            if animal_id in self.db.animals:
                if medicine_id in self.db.animals[animal_id].medicines:
                    self.db.animals[animal_id].medicines[medicine_id] += quantity
                else:
                    self.db.animals[animal_id].medicines[medicine_id] = quantity
            else:
                raise HTTPException(status_code=404, detail="Animal not found")
        else:
            raise HTTPException(status_code=404, detail="Medicine not found")


clinic = Clinic(db)
