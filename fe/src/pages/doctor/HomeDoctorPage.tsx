import Header from '../../components/Header'
import Footer from '../../components/Footer'

const todayAppointments = [
  {
    id: 'BK01',
    patientName: 'Bryan P. Hutagalung',
    complaint: 'Sakit tenggorokan',
    date: '13/12/2024',
    status: 'Lunas',
  },
  {
    id: 'BK01',
    patientName: 'Bryan P. Hutagalung',
    complaint: 'Sakit tenggorokan',
    date: '13/12/2024',
    status: 'Lunas',
  },
]

const todayColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'patientName', label: 'NAMA PASIEN', sortable: true },
  { key: 'complaint', label: 'KELUHAN', sortable: true },
  { key: 'date', label: 'TANGGAL', sortable: true },
  { key: 'status', label: 'STATUS', sortable: true },
]

export default function HomeDoctorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="dashboard" userName="dr. Kasyfil" />
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A0F2C] md:text-3xl">
              Hello, dr. Kasyfil!
            </h1>
            <p className="mt-2 text-gray-600">
              Here is your dashboard for today!
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="p-6 rounded-lg bg-white border border-gray-200">
              <p className="text-sm text-gray-600">TOTAL PATIENTS</p>
              <p className="text-2xl font-bold text-[#0A0F2C]">5</p>
            </div>
            <div className="p-6 rounded-lg bg-white border border-gray-200">
              <p className="text-sm text-gray-600">TOTAL APPOINTMENTS</p>
              <p className="text-2xl font-bold text-[#0A0F2C]">67</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-bold text-[#0A0F2C]">
                YOUR APPOINTMENT TODAY
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {todayColumns.map(column => (
                        <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {column.label}
                        </th>
                      ))}
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map((appointment, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-4 text-sm">{appointment.id}</td>
                        <td className="px-4 py-4 text-sm">{appointment.patientName}</td>
                        <td className="px-4 py-4 text-sm">{appointment.complaint}</td>
                        <td className="px-4 py-4 text-sm">{appointment.date}</td>
                        <td className="px-4 py-4 text-sm">{appointment.status}</td>
                        <td className="px-4 py-4 text-sm">
                          <button className="text-[#0EA5E9] hover:underline">
                            UPLOAD RESEP
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

