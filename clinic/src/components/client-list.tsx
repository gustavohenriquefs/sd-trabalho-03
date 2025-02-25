"use client"

import type { Client, Medicine } from "../models/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Animal } from "../models/types"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createAnimal, getClients, getMedicines, prescribeMedicine } from "../controllers/api"
import { UUID } from "crypto"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ClientListProps {
  initialClients: Client[]
}

export function AddAnimalDialog({ idOwner, getClients }: { idOwner: UUID, getClients: () => void }) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"dog" | "cat" | "rabbit">("dog")
  const [age, setAge] = useState("")
  const [breed, setBreed] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => {
    setIsOpen(false)
  }

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

    getClients()

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

        <form onSubmit={handleAddAnimal} className="flex flex-col space-y-4 gap-2">
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

export function ClientList({ initialClients }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>(initialClients || [])
  const [showAnimals, setShowAnimals] = useState<Record<string, boolean>>({})

  const toggleShowAnimals = (id: string) => {
    setShowAnimals((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleGetClients = async () => {
    const newClients = await getClients()
    setClients(newClients)
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
                getClients={() => handleGetClients()}
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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {animals.map((animal) => (
          <TableRow key={animal.id.toString()}>
            <TableCell>{animal.id.toString()}</TableCell>
            <TableCell>{animal.name}</TableCell>
            <TableCell>{animal.type}</TableCell>
            <TableCell>
              <PrescribeAnimalMedicineDialog
                idAnimal={animal.id}
                getClients={() => { }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function PrescribeAnimalMedicineDialog({
  idAnimal,
  getClients
}: { idAnimal: UUID, getClients: () => void }) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getMedicines().then(meds => {
        setMedicines(meds);
        setSelectedMedicine(meds.length > 0 ? meds[0] : null);
      });
    }
  }, [isOpen]);

  const handlePrescribeMedicine = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedMedicine) return;

    prescribeMedicine(idAnimal, selectedMedicine.id).then(() => {
      getClients();
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Prescribe Medicine</Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Prescribe Medicine</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col space-y-4 gap-2" onSubmit={handlePrescribeMedicine}>
          <label className="flex flex-col">
            <span>Medicine</span>

            <select
              className="border p-2 rounded"
              value={selectedMedicine?.id || ""}
              onChange={(e) => setSelectedMedicine(medicines.find(m => m.id === e.target.value) ?? null)}
            >
              {medicines.map(medicine => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" className="mt-2" disabled={!selectedMedicine}>
            Prescribe Medicine
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
