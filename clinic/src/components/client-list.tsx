"use client"

import type { Client } from "../models/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Animal } from "../models/types"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createAnimal } from "../controllers/api"
import { UUID } from "crypto"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ClientListProps {
  clients: Client[]
}

export function AddAnimalDialog({ idOwner, isOpen, onClose }: { idOwner: UUID, isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"dog" | "cat" | "rabbit">("dog")
  const [age, setAge] = useState("")
  const [breed, setBreed] = useState("")

  const handleAddAnimal = async (event: React.FormEvent) => {
    event.preventDefault()

    const newAnimal = {
      name,
      age: age,
      type,
      owner_id: idOwner,
      breed
    }

    await createAnimal(newAnimal)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button>Add Animal</Button>
      </DialogTrigger>
      <DialogContent className="p-6">

        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddAnimal} className="flex flex-col space-y-4">
          <label className="flex flex-col">
            <span>Name</span>
            <input className="border p-2 rounded" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Type</span>
            <select
              className="border p-2 rounded"
              value={type}
              onChange={(e) => setType(e.target.value as "dog" | "cat" | "rabbit")}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="rabbit">Rabbit</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span>Age</span>
            <input className="border p-2 rounded" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Breed</span>
            <input className="border p-2 rounded" type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
          </label>

          <Button type="submit" className="mt-2">Add Animal</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ClientList({ clients }: ClientListProps) {
  const [showAnimals, setShowAnimals] = useState<Record<string, boolean>>({})
  const [showAddAnimal, setShowAddAnimal] = useState<Record<string, boolean>>({})

  const toggleShowAnimals = (id: string) => {
    setShowAnimals((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleShowAddAnimal = (id: string) => {
    setShowAddAnimal((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Animals</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => <>
          <TableRow key={client.id.toString()}>
            <TableCell>{client.id.toString()}</TableCell>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.animals.length}</TableCell>
            <TableCell className="flex space-x-2 gap-2">
              <Button onClick={() => toggleShowAnimals(client.id.toString())}>
                {showAnimals[client.id.toString()] ? "Hide" : "Show"} Animals
              </Button>

              <AddAnimalDialog
                idOwner={client.id}
                isOpen={showAddAnimal[client.id.toString()]}
                onClose={() => toggleShowAddAnimal(client.id.toString())}
              />
            </TableCell>

          </TableRow>
          {showAnimals[client.id.toString()] && (
            <TableRow>
              <TableCell colSpan={4}>
                <AnimalsList animals={client.animals} />
              </TableCell>
            </TableRow>
          )}
        </>
        )}
      </TableBody>
    </Table>
  )
}

export interface AnimalsListProps {
  animals: Animal[]
}

export function AnimalsList({ animals }: AnimalsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animals.map((animal) => (
          <TableRow key={animal.id.toString()}>
            <TableCell>{animal.id.toString()}</TableCell>
            <TableCell>{animal.name}</TableCell>
            <TableCell>{animal.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
