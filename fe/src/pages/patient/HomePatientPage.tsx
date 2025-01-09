import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BackgroundImage from '../../assets/Background.png'
import MenuImage from '../../assets/Menu.png'

export default function HomePatientPage() {
  const menuItems = [
    {
      title: 'Appointment',
      description: 'Book an appointment with our doctors',
      to: '/patient/appointment',
    },
    {
      title: 'Schedule',
      description: 'View and manage your appointments',
      to: '/patient/schedule',
    },
    {
      title: 'Prescription',
      description: 'Access your medical prescriptions',
      to: '/patient/prescription',
    },
  ]

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName="Bryan" />
      <main className="flex-1 overflow-hidden">
        <div 
          className="relative h-[200px] bg-cover bg-center"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50">
            <div className="mx-auto max-w-7xl h-full flex items-center px-4 md:px-6 lg:px-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-2xl">
                Platform yang Mempermudah Berobat, Menjadwalkan, dan Mengelola Resep Obat
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#0A0F2C] md:text-2xl">
              Hello, Bryan!
            </h2>
            <p className="mt-1 text-gray-600">
              How can we help you today?
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 h-[calc(100vh-450px)]">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group block p-4 rounded-lg border border-gray-200 hover:border-[#0EA5E9] transition-colors h-full"
              >
                <div className="h-[60%] mb-4">
                  <img
                    src={MenuImage}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#0A0F2C] group-hover:text-[#0EA5E9] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}