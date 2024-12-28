import Link from 'next/link'

interface NavbarProps {
  className?: string;
}

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Layanan', href: '/services' },
  { label: 'Kontak', href: '/contact' },
]

export default function Navbar({ className }: NavbarProps) {
  return (
    <nav className={`w-full bg-white shadow-sm lg:block ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <ul className="flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-16 items-center text-base font-medium text-gray-700 transition-colors hover:text-[#2BBFB0]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

