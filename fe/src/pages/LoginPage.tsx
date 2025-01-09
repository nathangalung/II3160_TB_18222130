import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import AuthImage from '../assets/Auth.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
  
      // Navigate based on user role
      switch (data.user.role) {
        case 'PATIENT':
          navigate('/patient/home')
          break
        case 'DOCTOR':
          navigate('/doctor/home')
          break
        case 'PHARMACIST':
          navigate('/pharmacist/home')
          break
        default:
          navigate('/patient/home')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
              Login to your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-400">
                {error}
              </div>
            )}
            
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0EA5E9] px-4 py-2 text-white hover:bg-[#0EA5E9]/90 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-500">
            Don't Have An Account?{' '}
            <Link
              to="/register"
              className="text-[#0EA5E9] hover:underline font-medium"
            >
              Sign Up
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