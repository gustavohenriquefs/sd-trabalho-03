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

    def prescribe_medicine(self, medicine_id: UUID):
        if medicine_id in self.db.stock and self.db.stock[medicine_id].quantity > 0:
            self.db.stock[medicine_id].quantity -= 1
            if self.db.stock[medicine_id].quantity == 0:
                del self.db.stock[medicine_id]
        else:
            raise HTTPException(status_code=404, detail="Medicine out of stock or not found")

clinic = Clinic(db)
