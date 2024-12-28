import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AuthImage from '../assets/Auth.png'

type UserType = 'patient' | 'doctor' | 'pharmacist' | null

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<UserType>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userType) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <div className="h-screen overflow-hidden flex">
      <Link
        to="/"
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </Link>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-gray-500">Welcome back</h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0F2C]">
              Register your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                onClick={() => setUserType('patient')}
                disabled={loading}
                className="w-full rounded-lg bg-[#0EA5E9] px-4 py-2 text-white hover:bg-[#0EA5E9]/90 disabled:opacity-50"
              >
                {loading && userType === 'patient' ? 'Loading...' : 'Register as Patient'}
              </button>

              <button
                type="submit"
                onClick={() => setUserType('doctor')}
                disabled={loading}
                className="w-full rounded-lg bg-[#0A0F2C] px-4 py-2 text-white hover:bg-[#0A0F2C]/90 disabled:opacity-50"
              >
                {loading && userType === 'doctor' ? 'Loading...' : 'Register as Doctor'}
              </button>

              <button
                type="submit"
                onClick={() => setUserType('pharmacist')}
                disabled={loading}
                className="w-full rounded-lg border-2 border-[#0EA5E9] px-4 py-2 text-[#0EA5E9] hover:bg-[#0EA5E9]/10 disabled:opacity-50"
              >
                {loading && userType === 'pharmacist' ? 'Loading...' : 'Register as Pharmacist'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-500">
            Already Have An Account?{' '}
            <Link
              to="/login"
              className="text-[#0EA5E9] hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img
          src={AuthImage}
          alt="Medical consultation"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  )
}