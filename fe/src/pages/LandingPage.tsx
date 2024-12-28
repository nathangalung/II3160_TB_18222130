import Header from '../components/Header'
import { Link } from 'react-router-dom'
import BackgroundImage from '../assets/Background.png' // Adjust path as needed
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <div className="absolute inset-0 bg-black/50" />
      <Header variant="landing" />
      <main className="flex-1 relative flex items-center">
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              Integrated Solution For Sustainable Healthcare
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Medico is here to make it easier for patients to get health services,
              help doctors manage their schedules, and make it easier for pharmacists
              to manage prescriptions digitally.
            </p>
            <Link 
              to="/register"
              className="inline-block rounded-full bg-[#0EA5E9] px-6 sm:px-8 py-2 sm:py-3 text-white hover:bg-[#0EA5E9]/90"
            >
              Register now!
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}