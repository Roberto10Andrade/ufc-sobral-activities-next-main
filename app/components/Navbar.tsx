'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { 
      href: '/', 
      label: 'Início',
      icon: '🏠'
    },
    { 
      href: '/atividades', 
      label: 'Atividades',
      icon: '📅'
    },
    { 
      href: '/search', 
      label: 'Buscar',
      icon: '🔍'
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/Imagem1.png"
              alt="UFC Sobral Logo"
              width={180}
              height={60}
              priority
              className="w-auto h-12 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transform transition-all duration-200 ease-in-out
                  hover:scale-105 active:scale-95
                  ${isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <Link
              href="/atividades/new"
              className="
                inline-flex items-center gap-2 px-4 py-2 ml-2
                bg-gradient-to-r from-blue-600 to-blue-700
                text-white font-medium text-sm rounded-full
                shadow-md hover:shadow-lg
                transform transition-all duration-200 ease-in-out
                hover:scale-105 active:scale-95
                hover:from-blue-700 hover:to-blue-800
              "
            >
              <span className="text-lg">➕</span>
              <span>Nova Atividade</span>
            </Link>

            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium w-full
                  ${isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <Link
              href="/atividades/new"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-2 px-4 py-3 w-full
                bg-gradient-to-r from-blue-600 to-blue-700
                text-white font-medium text-sm rounded-lg
              "
            >
              <span className="text-lg">➕</span>
              <span>Nova Atividade</span>
            </Link>

            <div className="px-4 pt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
