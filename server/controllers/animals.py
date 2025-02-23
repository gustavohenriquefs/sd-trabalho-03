from fastapi import APIRouter, HTTPException
from typing import Union

from database import db
from models.animals import Animal, Dog, Cat, Rabbit

router = APIRouter()

@router.post("/", response_model=Animal)
def create_animal(animal: Union[Dog, Cat, Rabbit]):
    if animal.owner_id not in db.clients:
        raise HTTPException(status_code=400, detail="Owner must be created first")
    
    if animal.id in db.animals:
        raise HTTPException(status_code=400, detail="Animal already exists")
    
    db.animals[animal.id] = animal
    db.clients[animal.owner_id].animals.append(animal.id)
    
    return animal

@router.get("/", response_model=list[Animal])
def get_animals():
    if not db.animals:
        raise HTTPException(status_code=404, detail="No animals found")
    return list(db.animals.values())
