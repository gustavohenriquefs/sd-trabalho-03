"use client"

import type { Medicine } from "../models/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { UUID } from "crypto"
import { getMedicines, prescribeMedicine, removeMedicine } from "../controllers/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"

interface MedicineListProps {
  initMedicineList: Medicine[]
}

export function MedicineList({
  initMedicineList
}: MedicineListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [medicines, setMedicines] = useState(initMedicineList)

  const handleAction = async (
    action: (formData: FormData) => Promise<{ success: boolean, error?: unknown }>,
    id: string
  ) => {
    startTransition(() => {
      const formData = new FormData()
      formData.append("id", id)
      action(formData).then((result) => {
        if (result.success) {
          router.refresh()
        }
      })
    })
  }

  const handleRemoveMedicine = async (formData: FormData) => {
    const id = formData.get("id") as UUID
    try {
      await removeMedicine(id)

      setMedicines(await getMedicines())

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const onPrescribeMedicine = async (idAnimal: UUID, idMedicine: UUID) => {
    try {
      await prescribeMedicine(idAnimal, idMedicine)

      setMedicines(await getMedicines())
    } catch (error) {
      console.error("Failed to prescribe medicine:", error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {medicines.map((medicine) => (
          <TableRow key={medicine.id}>
            <TableCell>{medicine.name}</TableCell>
            <TableCell>{medicine.quantity}</TableCell>
            <TableCell className="flex space-x-2 gap-2">
              <GetAnimalIdDialog
                idMedicine={medicine.id}
                onSubmit={onPrescribeMedicine}
              />

              <form 
                action={() => handleAction(handleRemoveMedicine, medicine.id.toString())} 
                className="flex flex-col space-y-4 gap-2" 
                method="post"
                >
                <input type="hidden" name="id" value={medicine.id.toString()} />
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : "Remove"}
                </Button>
              </form>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function GetAnimalIdDialog({
  idMedicine,
  onSubmit
}: {
  idMedicine: UUID,
  onSubmit: (idAnimal: UUID, idMedicine: UUID) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [idAnimal, setIdAnimal] = useState<UUID | null>()

  const handleIdAnimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdAnimal(e.target.value as UUID)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!idAnimal) return

    onSubmit(idAnimal, idMedicine)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Prescribe medicine</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Animal ID</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col space-y-4 gap-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={idAnimal ?? ""} onChange={
              handleIdAnimalChange
            } required />
          </div>
          <Button type="submit" className="w-full">
            Prescribe Medicine
          </Button>
        </form>
      </DialogContent>
    </Dialog >
  )
}