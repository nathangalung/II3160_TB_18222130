import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface AppointmentDetail {
  id: string
  patientName: string
  date: string
  complaint: string
  medicalHistory: string
}

export default function AppointmentDoctorPage() {
  // This would typically come from your API or route params
  const appointmentDetail: AppointmentDetail = {
    id: 'BK01',
    patientName: 'Bryan P. Hutagalung',
    date: '13 Desember 2024',
    complaint: 'Sakit tenggorokan',
    medicalHistory: 'Sakit tenggorokan'
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAccept = async () => {
    try {
      setIsSubmitting(true)
      // Add your accept logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Appointment accepted')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecline = async () => {
    try {
      setIsSubmitting(true)
      // Add your decline logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Appointment declined')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName="dr. Kasyfil" />
      
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link
              to="/doctor/home"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="mb-8 text-2xl font-bold text-[#0A0F2C] md:text-3xl">
            #{appointmentDetail.id} {appointmentDetail.patientName}
          </h1>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#0A0F2C]">
              Appointment Detail
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {appointmentDetail.date}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Keluhan
                  </label>
                  <div className="min-h-[120px] rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-900">
                      {appointmentDetail.complaint}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Riwayat Penyakit
                  </label>
                  <div className="min-h-[120px] rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-900">
                      {appointmentDetail.medicalHistory}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={handleDecline}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#0EA5E9] px-8 py-2.5 text-sm font-medium text-[#0EA5E9] hover:bg-[#0EA5E9]/5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Decline'}
                </button>
                <button
                  onClick={handleAccept}
                  disabled={isSubmitting}
                  className="rounded-full bg-[#0EA5E9] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#0EA5E9]/90 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

