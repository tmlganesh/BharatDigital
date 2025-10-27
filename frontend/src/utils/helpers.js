import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num, isHindi = false) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + (isHindi ? ' करोड़' : ' Cr')
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + (isHindi ? ' लाख' : ' L')
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + (isHindi ? ' हज़ार' : ' K')
  }
  return new Intl.NumberFormat(isHindi ? 'hi-IN' : 'en-IN').format(num)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getPerformanceColor(status) {
  switch (status) {
    case 'above':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'below':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getPerformanceText(status, isHindi = false) {
  switch (status) {
    case 'above':
      return isHindi ? 'औसत से ऊपर' : 'Above Avg'
    case 'below':
      return isHindi ? 'औसत से नीचे' : 'Below Avg'
    default:
      return isHindi ? 'औसत' : 'Average'
  }
}

export function getPerformanceIcon(status) {
  switch (status) {
    case 'above':
      return '📈'
    case 'below':
      return '📉'
    default:
      return '📊'
  }
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function getCurrentMonth() {
  return monthNames[new Date().getMonth()]
}

export function getCurrentYear() {
  return new Date().getFullYear()
}