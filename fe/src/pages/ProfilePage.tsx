import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileImage from '../assets/Profile.png'

interface ProfileData {
  name: string
  email: string
  password: string
  role: 'Patient' | 'Doctor' | 'Pharmacist'
  image: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return {
      name: user.name || '',
      email: user.email || '',
      password: '************',
      role: user.role || 'PATIENT',
      image: user.imageUrl || ProfileImage
    }
  })

  const handleEdit = () => setIsEditing(true)

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          ...(profileData.password !== '************' && {
            password: profileData.password
          })
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Update local storage
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        name: profileData.name,
        email: profileData.email
      }))

      setIsEditing(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header variant="dashboard" userName={profileData.name} />
      
      <main className="flex-1 bg-white px-4 py-8 md:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-2xl font-bold text-[#0A0F2C] md:text-3xl">
            Profile
          </h1>

          <div className="rounded-lg border border-gray-200 p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[240px,1fr]">
              <div className="space-y-4">
                <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-lg">
                  <img
                    src={profileData.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="w-full rounded-lg bg-[#003B73] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#003B73]/90"
                  >
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-[#0A0F2C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0A0F2C]/90"
                  >
                    Log Out
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-block rounded-md bg-[#0EA5E9] px-4 py-1 text-sm font-medium text-white">
                  {profileData.role}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-500 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-500 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={profileData.password}
                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-500 focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={!isEditing}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
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

