from typing import Dict
from uuid import UUID
from models.animals import Animal
from models.clients import Client
from models.medicines import Medicine

class Database:
    def __init__(self):
        self.stock: Dict[UUID, Medicine] = {}
        self.clients: Dict[UUID, Client] = {}
        self.animals: Dict[UUID, Animal] = {}

db = Database()