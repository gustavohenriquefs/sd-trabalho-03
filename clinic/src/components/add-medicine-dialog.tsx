"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addMedicine } from "../controllers/api"
import { useRouter } from "next/navigation"

export function AddMedicineDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addMedicine({
        name,
        quantity: Number.parseInt(quantity, 10),
      })
      setOpen(false)
      setName("")
      setQuantity("")
      router.refresh()
    } catch (error) {
      console.error("Failed to add medicine:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Medicine</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 gap-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Medicine
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

