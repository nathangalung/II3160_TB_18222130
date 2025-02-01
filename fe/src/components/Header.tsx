import { MessageCircle, Home, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LogoImage from '../assets/Logo.png'
import Notification from './Notification'

interface HeaderProps {
  variant?: 'landing' | 'dashboard'
  userName?: string
}

const NavigationItems = () => {
  const [userRole, setUserRole] = useState<string>('')
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserRole(user.role || '')
  }, [])

  const baseRoute = `/${userRole?.toLowerCase()}`
  
  return (
    <>
      <Link
        to={`${baseRoute}/home`}
        className="flex items-center gap-2 text-white hover:text-[#0EA5E9] transition-colors"
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      
      <Link
        to="/chat"
        className="flex items-center gap-2 text-white hover:text-[#0EA5E9] transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        <span>Chat</span>
      </Link>
      
      <Notification />
    </>
  )
}

export default function Header({ variant = 'landing', userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentUserName, setCurrentUserName] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.name || userName || ''
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      setCurrentUserName(user.name || userName || '')
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userUpdated', handleStorageChange)
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userUpdated', handleStorageChange)
    }
  }, [userName])

  return (
    <header className="sticky top-0 z-50 bg-[#0A0F2C] px-4 py-4 md:px-6">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src={LogoImage} 
            alt="Medico Logo" 
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {variant === 'landing' ? (
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/register"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#0A0F2C] hover:bg-gray-100 transition-colors md:px-6 md:py-2"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-[#0EA5E9] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0EA5E9]/90 transition-colors md:px-6 md:py-2"
            >
              Login
            </Link>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-6">
              <NavigationItems />
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0EA5E9] text-white">
                  {currentUserName?.charAt(0)}
                </div>
                <span>{currentUserName}</span>
              </Link>
            </nav>

            <div className="md:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {isMenuOpen && (
                <nav className="absolute right-0 top-full mt-2 w-48 bg-[#0A0F2C] rounded-lg shadow-lg border border-white/10 p-4 flex flex-col gap-4">
                  <NavigationItems />
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0EA5E9] text-white">
                      {currentUserName?.charAt(0)}
                    </div>
                    <span>{currentUserName}</span>
                  </Link>
                </nav>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}