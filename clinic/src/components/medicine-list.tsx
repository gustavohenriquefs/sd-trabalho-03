"use client"

import type { Medicine } from "../models/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { UUID } from "crypto"
import { getMedicines, prescribeMedicine, removeMedicine } from "../controllers/api"

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

  const handlePrescribeMedicine = async (formData: FormData) => {
    const id = formData.get("id") as UUID
    try {
      await prescribeMedicine(id)
      
      setMedicines(await getMedicines())
      
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
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

              <form action={() => handleAction(handlePrescribeMedicine, medicine.id.toString())}>
                <input type="hidden" name="id" value={medicine.id.toString()} />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : "Prescribe"}
                </Button>
              </form>

              <form action={() => handleAction(handleRemoveMedicine, medicine.id.toString())}>
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