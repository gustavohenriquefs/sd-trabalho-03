import { Suspense } from "react"
import { getClients, getMedicines } from "../src/controllers/api"
import { ClientList } from "../src/components/client-list"
import { MedicineList } from "../src/components/medicine-list"
import { AddClientDialog } from "../src/components/add-client-dialog"
import { AddMedicineDialog } from "../src/components/add-medicine-dialog"

export default async function Home() {
  const [clients, medicines] = await Promise.all([getClients(), getMedicines()])

  return (
    <main className="container mx-auto py-10">
      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Clients</h2>
            <AddClientDialog />
          </div>
          <Suspense fallback={<div>Loading clients...</div>}>
            <ClientList clients={clients} />
          </Suspense>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Medicine Stock</h2>
            <AddMedicineDialog />
          </div>
          <Suspense fallback={<div>Loading medicines...</div>}>
            <MedicineList initMedicineList={medicines} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}