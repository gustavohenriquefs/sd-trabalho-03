# main.py
from fastapi import FastAPI, HTTPException
from controllers import animals, clients, medicines
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.include_router(animals.router, prefix="/animals", tags=["Animals"])
app.include_router(clients.router, prefix="/clients", tags=["Clients"])
app.include_router(medicines.router, prefix="/medicines", tags=["Medicines"])
