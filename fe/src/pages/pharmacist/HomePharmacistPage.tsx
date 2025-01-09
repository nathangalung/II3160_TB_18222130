import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const prescriptionData = [
  {
    id: 'BK01',
    patientName: 'Bryan P. Hutagalung',
    doctorName: 'dr. Kasyfil',
    date: '13/12/2024',
    prescription: 'Ambroxol 1 strip',
    status: 'Lunas',
  },
  {
    id: 'BK01',
    patientName: 'Bryan P. Hutagalung',
    doctorName: 'dr. Kasyfil',
    date: '13/12/2024',
    prescription: 'Decolsin',
    status: 'Lunas',
  },
]

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'patientName', label: 'NAMA PASIEN', sortable: true },
  { key: 'doctorName', label: 'NAMA DOKTER', sortable: true },
  { key: 'date', label: 'TANGGAL', sortable: true },
  { key: 'prescription', label: 'RESEP', sortable: true },
  { key: 'status', label: 'STATUS', sortable: true },
]

export default function HomePharmacistPage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="dashboard" userName="Bryan" />
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-2xl font-bold text-[#0A0F2C] md:text-3xl">
            Prescription Request
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {prescriptionData.map((item, index) => (
                  <tr 
                  key={index} 
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/pharmacist/prescription`)}
                >
                    <td className="px-4 py-4 text-sm">{item.id}</td>
                    <td className="px-4 py-4 text-sm">{item.patientName}</td>
                    <td className="px-4 py-4 text-sm">{item.doctorName}</td>
                    <td className="px-4 py-4 text-sm">{item.date}</td>
                    <td className="px-4 py-4 text-sm">{item.prescription}</td>
                    <td className="px-4 py-4 text-sm">{item.status}</td>
                    <td className="px-4 py-4 text-sm">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/pharmacist/prescription`)
                        }}
                        className="text-[#0EA5E9] hover:underline"
                      >
                        AKSI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

