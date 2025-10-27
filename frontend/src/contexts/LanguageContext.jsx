import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('mgnrega-language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('mgnrega-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  const formatNumber = (num) => {
    if (language === 'hi') {
      // Use Hindi numerals if needed, for now keeping Arabic numerals
      return new Intl.NumberFormat('hi-IN').format(num)
    }
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const value = {
    language,
    toggleLanguage,
    t,
    formatNumber,
    formatCurrency,
    isHindi: language === 'hi'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}