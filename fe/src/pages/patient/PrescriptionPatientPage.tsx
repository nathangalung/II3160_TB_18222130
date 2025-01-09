import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import MedicineImage from '../../assets/Medicine.png'
import BackgroundImage from '../../assets/Background2.png'

interface Medicine {
  id: string
  name: string
  image: string
  isPrescribed?: boolean
}

const prescribedMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Ambroxol',
    image: MedicineImage,
    isPrescribed: true
  },
  {
    id: '2',
    name: 'Ambroxol',
    image: MedicineImage,
    isPrescribed: true
  },
  {
    id: '3',
    name: 'Ambroxol',
    image: MedicineImage,
    isPrescribed: true
  }
]

const otherMedicines: Medicine[] = Array(6).fill({
  id: '4',
  name: 'Ambroxol',
  image: MedicineImage,
  isPrescribed: false
})

export default function PrescriptionPatientPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName="Bryan" />
      
      <main className="flex-1 overflow-y-auto">
        <div 
          className="relative h-[400px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50">
            <div className="h-full flex items-center justify-center px-4">
              <div className="max-w-3xl space-y-4 text-center">
                <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  Pesan Obat dengan Mudah, Aman, dan Cepat
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <section className="mb-12">
            <h2 className="mb-6 text-lg font-medium text-[#0A0F2C]">
              Obat yang sesuai dengan resep dari dokter Anda.
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prescribedMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-center text-lg font-medium text-[#0EA5E9]">
                    {medicine.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Other Medicines Section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#0A0F2C]">
                Anda juga bisa membeli obat lain yang ada di Medico
              </h2>
              <button className="text-sm text-[#0EA5E9] hover:underline">
                See more
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {otherMedicines.map((medicine, index) => (
                <div
                  key={`${medicine.id}-${index}`}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-center text-lg font-medium text-[#0EA5E9]">
                    {medicine.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

