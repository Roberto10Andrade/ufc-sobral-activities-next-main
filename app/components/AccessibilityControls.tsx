'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type FontSize = 'normal' | 'large' | 'larger'
type Contrast = 'normal' | 'high' | 'inverted'

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState<FontSize>('normal')
  const [contrast, setContrast] = useState<Contrast>('normal')
  const [dyslexicFont, setDyslexicFont] = useState(false)

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      const { fontSize: savedFontSize, contrast: savedContrast, dyslexicFont: savedDyslexicFont } = JSON.parse(savedSettings)
      setFontSize(savedFontSize)
      setContrast(savedContrast)
      setDyslexicFont(savedDyslexicFont)
      applySettings(savedFontSize, savedContrast, savedDyslexicFont)
    }
  }, [])

  const applySettings = (newFontSize: FontSize, newContrast: Contrast, newDyslexicFont: boolean) => {
    // Aplicar tamanho da fonte
    document.documentElement.setAttribute('data-font-size', newFontSize)

    // Aplicar contraste
    document.documentElement.classList.remove('high-contrast', 'inverted-colors')
    if (newContrast === 'high') {
      document.documentElement.classList.add('high-contrast')
    } else if (newContrast === 'inverted') {
      document.documentElement.classList.add('inverted-colors')
    }

    // Aplicar fonte para dislexia
    if (newDyslexicFont) {
      document.documentElement.classList.add('dyslexic-font')
    } else {
      document.documentElement.classList.remove('dyslexic-font')
    }

    // Salvar configurações
    localStorage.setItem('accessibility-settings', JSON.stringify({
      fontSize: newFontSize,
      contrast: newContrast,
      dyslexicFont: newDyslexicFont
    }))
  }

  const updateFontSize = (newSize: FontSize) => {
    setFontSize(newSize)
    applySettings(newSize, contrast, dyslexicFont)
  }

  const updateContrast = (newContrast: Contrast) => {
    setContrast(newContrast)
    applySettings(fontSize, newContrast, dyslexicFont)
  }

  const toggleDyslexicFont = () => {
    const newDyslexicFont = !dyslexicFont
    setDyslexicFont(newDyslexicFont)
    applySettings(fontSize, contrast, newDyslexicFont)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[var(--primary-color)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--primary-color-dark)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
        aria-label="Controles de acessibilidade"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64 border border-gray-200 dark:border-gray-700"
            role="dialog"
            aria-label="Opções de acessibilidade"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Acessibilidade</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tamanho da Fonte</h3>
                <div className="flex gap-2">
                  {(['normal', 'large', 'larger'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateFontSize(size)}
                      className={`flex-1 px-3 py-2 rounded ${
                        fontSize === size
                          ? 'bg-[var(--primary-color)] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } transition-colors duration-200`}
                      aria-pressed={fontSize === size}
                    >
                      {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Contraste</h3>
                <div className="flex flex-col gap-2">
                  {(['normal', 'high', 'inverted'] as Contrast[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateContrast(mode)}
                      className={`px-3 py-2 rounded ${
                        contrast === mode
                          ? 'bg-[var(--primary-color)] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } transition-colors duration-200`}
                      aria-pressed={contrast === mode}
                    >
                      {mode === 'normal' ? 'Contraste Normal' : mode === 'high' ? 'Alto Contraste' : 'Cores Invertidas'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fonte para Dislexia</h3>
                <button
                  onClick={toggleDyslexicFont}
                  className={`w-full px-3 py-2 rounded ${
                    dyslexicFont
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                  aria-pressed={dyslexicFont}
                >
                  {dyslexicFont ? 'Fonte para Dislexia Ativa' : 'Ativar Fonte para Dislexia'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
