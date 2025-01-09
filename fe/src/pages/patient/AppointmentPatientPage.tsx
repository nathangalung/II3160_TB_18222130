import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DoctorImage from '../../assets/Doctor.png'

interface Doctor {
  id: string
  name: string
  image: string
}

const doctors: Doctor[] = Array(6).fill({
  id: '1',
  name: 'dr. Kasyfil',
  image: DoctorImage
})

export default function AppointmentPatientPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: '',
    complaint: '',
    medicalHistory: '',
    selectedDoctor: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
  
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
  
      if (!response.ok) {
        throw new Error('Failed to create appointment')
      }
  
      navigate('/patient/schedule')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName="Bryan" />
      
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link
              to="/patient/home"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A0F2C] md:text-3xl">
              Make a New Appointment
            </h1>
            <p className="mt-2 text-gray-600">
              Complete all informations accordingly and wait for the follow up approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Detail */}
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0A0F2C]">
                  Appointment Detail
                </h2>
                <span className="text-sm text-gray-500">Step 1 of 3</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Keluhan
                  </label>
                  <textarea
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    placeholder="Deskripsikan keluhan Anda disini"
                    className="h-32 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0A0F2C]">
                  Riwayat Penyakit
                </h2>
                <span className="text-sm text-gray-500">Step 2 of 3</span>
              </div>
              
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                placeholder="Deskripsikan riwayat penyakit yang Anda miliki"
                className="h-32 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                required
              />
            </div>

            {/* Doctor Selection */}
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0A0F2C]">
                  Pilih Dokter Anda
                </h2>
                <span className="text-sm text-gray-500">Step 3 of 3</span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor, index) => (
                    <label key={index} className="...existing classes...">
                        <input
                        type="radio"
                        name="doctor"
                        value={doctor.id}
                        checked={formData.selectedDoctor === doctor.id}
                        onChange={(e) => setFormData({ ...formData, selectedDoctor: e.target.value })}
                        className="sr-only"
                        />
                        <div className="flex flex-col items-center">
                        <div className="mb-3 h-24 w-24 overflow-hidden rounded-full">
                            <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="h-full w-full object-cover"
                            />
                        </div>
                        <p className="text-center text-sm font-medium text-[#0EA5E9]">
                            {doctor.name}
                        </p>
                        </div>
                    </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-[#0EA5E9] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#0EA5E9]/90 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

