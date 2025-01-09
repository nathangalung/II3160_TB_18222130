'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ChevronDown, Search } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface Appointment {
  id: string
  bookingDate: string
  doctor: string
  appointment: string
  date: string
  payment: string
  status: 'Booked' | 'In Progress' | 'Completed' | 'Cancelled'
}

const appointments: Appointment[] = [
  {
    id: 'BK01',
    bookingDate: '10/12/2024',
    doctor: 'dr. Kasyfil',
    appointment: 'Medical Check Up',
    date: '11/12/2024',
    payment: 'Rp1.300.000',
    status: 'Booked'
  },
  {
    id: 'BK01',
    bookingDate: '10/12/2024',
    doctor: 'dr. Kasyfil',
    appointment: 'Chemotherapy',
    date: '13/12/2024',
    payment: 'Rp1.300.000',
    status: 'In Progress'
  }
]

const statusColors = {
  'Booked': 'text-green-600',
  'In Progress': 'text-amber-600',
  'Completed': 'text-blue-600',
  'Cancelled': 'text-red-600'
}

export default function SchedulePatientPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All Status')

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = Object.values(appointment).some(value =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesStatus = statusFilter === 'All Status' || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName="Bryan" />
      
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              to="/patient/home"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="mb-8 text-2xl font-bold text-[#0A0F2C] md:text-3xl">
            Your Schedule
          </h1>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
              />
            </div>
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
              >
                <option>All Status</option>
                <option>Booked</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      BOOKING DATE
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      DOCTOR
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      APPOINTMENT
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      DATE
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      PAYMENT
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      STATUS
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                      RESCHEDULE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {appointment.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {appointment.bookingDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {appointment.doctor}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {appointment.appointment}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {appointment.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {appointment.payment}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className={statusColors[appointment.status]}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <button className="text-[#0EA5E9] hover:text-[#0EA5E9]/80">
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

