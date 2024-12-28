import { Link } from 'react-router-dom'
import LogoImage from '../assets/Logo.png'

export default function Footer() {
    return (
        <footer className="bg-[#0A0F2C] px-4 py-4 md:px-6">
        <div className="mx-auto max-w-7xl space-y-4">
            <div className="flex flex-col items-start gap-2">
            <img
                src={LogoImage}
                alt="Medico Logo"
                className="h-6 w-auto md:h-8"
            />
            <p className="text-xs text-gray-400 md:text-sm">
                Platform that Makes it Easy to Get Medicine,
                Schedule, and Manage Prescriptions
            </p>
            </div>
            
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
                ©2024 MEDICO All rights reserved
            </p>
            <div className="flex gap-4">
                <Link
                to="/privacy"
                className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                Privacy & Policy
                </Link>
                <Link
                to="/terms"
                className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                Terms & Condition
                </Link>
            </div>
            </div>
        </div>
        </footer>
    )
}