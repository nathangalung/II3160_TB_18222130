import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import MedicineImage from '../../assets/Medicine.png'

interface PrescriptionDetail {
  id: string
  patientName: string
  medicineName: string
  medicineImage: string
  quantity: string
  instructions: string
}

export default function PrescriptionPharmacistPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const prescriptionDetail: PrescriptionDetail = {
    id: 'BK01',
    patientName: 'Bryan P. Hutagalung',
    medicineName: 'Ambroxol HCL',
    medicineImage: MedicineImage,
    quantity: '10 tablet',
    instructions: '2 x sehari setelah makan'
  }

  const handleAccept = async () => {
    try {
      setIsSubmitting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Prescription accepted')
      navigate('/pharmacist/home')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecline = async () => {
    try {
      setIsSubmitting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Prescription declined')
      navigate('/pharmacist/home')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName="Bryan" />
      
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link
              to="/pharmacist/home"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="mb-8 text-2xl font-bold text-[#0A0F2C] md:text-3xl">
            #{prescriptionDetail.id} {prescriptionDetail.patientName}
          </h1>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#0A0F2C]">
              Prescription Detail
            </h2>
            
            <div className="grid gap-8 md:grid-cols-[240px,1fr]">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={prescriptionDetail.medicineImage}
                  alt={prescriptionDetail.medicineName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Nama Obat
                  </label>
                  <input
                    type="text"
                    value={prescriptionDetail.medicineName}
                    readOnly
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm bg-gray-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Kuantitas
                  </label>
                  <input
                    type="text"
                    value={prescriptionDetail.quantity}
                    readOnly
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm bg-gray-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Anjuran Konsumsi
                  </label>
                  <div className="min-h-[100px] rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-900">
                      {prescriptionDetail.instructions}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    onClick={handleDecline}
                    disabled={isSubmitting}
                    className="rounded-full border border-[#0EA5E9] px-8 py-2.5 text-sm font-medium text-[#0EA5E9] hover:bg-[#0EA5E9]/5 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Decline'}
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={isSubmitting}
                    className="rounded-full bg-[#0EA5E9] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#0EA5E9]/90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Accept'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}