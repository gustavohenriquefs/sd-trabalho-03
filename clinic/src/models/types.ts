import type { UUID } from "crypto"

export type Client = {
  id: UUID
  name: string
  animals: Animal[]
}

export type Animal = {
  id: UUID
  owner_id: UUID
  name: string
  type: "dog" | "cat" | "rabbit"
  age: string
  breed: string
}

export type Medicine = {
  id: UUID
  name: string
  quantity: number
}

export type Vaccine = Medicine & {
  dosage: string
}

export type Pill = Medicine & {
  milligrams: number
}

