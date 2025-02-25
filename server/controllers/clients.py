from typing import List
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from database import db
from models.clients import Client

router = APIRouter()


@router.post("/", response_model=Client)
def create_client(client: Client):
    try:
        print(f"Received data: {client}")

        if not hasattr(client, "id") or client.id is None:
            client.id = uuid4()

        if client.id in db.clients:
            raise HTTPException(status_code=400, detail="Client already exists")

        db.clients[client.id] = client
        print(f"Client created: {client}")
        return client

    except Exception as e:
        print(f"Error creating client: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[dict])
def get_clients():
    if not db.clients:
        raise HTTPException(status_code=404, detail="No clients found")

    clients_with_animals = []

    for client in db.clients.values():
        animal_objects = []

        for animal_id in client.animals:
            if animal_id in db.animals:
                animal_objects.append(db.animals[animal_id])

        clients_with_animals.append(
            {"id": str(client.id), "name": client.name, "animals": animal_objects}
        )

    return clients_with_animals
