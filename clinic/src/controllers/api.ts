import type { UUID } from "crypto"
import type { Client, Animal, Medicine } from "../models/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${API_URL}/clients`)
  if (res.status === 404) return new Promise((resolve) => resolve([]))
  if (!res.ok) throw new Error("Failed to fetch clients")
  return res.json()
}

export async function createClient(client: Omit<Client, "id" | "animals">): Promise<Client> {
  const res = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  })
  if (!res.ok) throw new Error("Failed to create client")
  return res.json()
}

export async function getAnimals(): Promise<Animal[]> {
  const res = await fetch(`${API_URL}/animals`)
  if (!res.ok) throw new Error("Failed to fetch animals")
  return res.json()
}

export async function createAnimal(animal: Omit<Animal, "id">): Promise<Animal> {
  const res = await fetch(`${API_URL}/animals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(animal),
  })
  if (!res.ok) throw new Error("Failed to create animal")
  return res.json()
}

export async function getMedicines(): Promise<Medicine[]> {
  const res = await fetch(`${API_URL}/medicines`)

  if (res.status === 404) return new Promise((resolve) => resolve([]))
    
  if (!res.ok) throw new Error("Failed to fetch medicines")
  return res.json()
}

export async function addMedicine(medicine: Omit<Medicine, "id">): Promise<Medicine> {
  const res = await fetch(`${API_URL}/medicines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medicine),
  })

  if (!res.ok) throw new Error("Failed to add medicine")

  return res.json()
}

export async function removeMedicine(id: UUID): Promise<void> {
  const res = await fetch(`${API_URL}/medicines/${id}`, {
    method: "DELETE",
  })
  if (res.status === 404) throw new Error("Medicine not found")

  if (!res.ok) throw new Error("Failed to remove medicine")
}

export async function prescribeMedicine(id: UUID): Promise<void> {
  const res = await fetch(`${API_URL}/medicines/prescribe/${id}`, {
    method: "POST",
  })

  if (!res.ok) throw new Error("Failed to prescribe medicine")
}
