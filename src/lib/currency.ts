/**
 * Multi-currency support for international users
 */

export interface CurrencyConfig {
  code: string
  symbol: string
  amount: number // Amount in smallest unit (e.g., pence, cents)
  displayAmount: string
  name: string
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  GBP: {
    code: 'gbp',
    symbol: '£',
    amount: 999, // £9.99/month
    displayAmount: '£9.99',
    name: 'British Pound'
  },
  USD: {
    code: 'usd',
    symbol: '$',
    amount: 1299, // $12.99/month
    displayAmount: '$12.99',
    name: 'US Dollar'
  },
  EUR: {
    code: 'eur',
    symbol: '€',
    amount: 1099, // €10.99/month
    displayAmount: '€10.99',
    name: 'Euro'
  },
  CAD: {
    code: 'cad',
    symbol: 'C$',
    amount: 1499, // C$14.99/month
    displayAmount: 'C$14.99',
    name: 'Canadian Dollar'
  },
  AUD: {
    code: 'aud',
    symbol: 'A$',
    amount: 1599, // A$15.99/month
    displayAmount: 'A$15.99',
    name: 'Australian Dollar'
  },
  INR: {
    code: 'inr',
    symbol: '₹',
    amount: 99900, // ₹999/month
    displayAmount: '₹999',
    name: 'Indian Rupee'
  }
}

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // UK
  GB: 'GBP',
  // USA
  US: 'USD',
  // Eurozone
  AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR',
  FR: 'EUR', DE: 'EUR', GR: 'EUR', IE: 'EUR', IT: 'EUR',
  LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR', NL: 'EUR',
  PT: 'EUR', SK: 'EUR', SI: 'EUR', ES: 'EUR',
  // Canada
  CA: 'CAD',
  // Australia
  AU: 'AUD',
  // India
  IN: 'INR',
}

/**
 * Detect user's currency based on their location
 */
export async function detectUserCurrency(): Promise<CurrencyConfig> {
  try {
    // Try to get user's country from IP
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    const countryCode = data.country_code
    const currencyCode = COUNTRY_TO_CURRENCY[countryCode] || 'GBP'
    
    return CURRENCIES[currencyCode]
  } catch (error) {
    console.error('Currency detection failed:', error)
    // Default to GBP
    return CURRENCIES.GBP
  }
}

/**
 * Get currency from browser locale
 */
export function getCurrencyFromLocale(): CurrencyConfig {
  if (typeof window === 'undefined') {
    return CURRENCIES.GBP
  }

  const locale = navigator.language || 'en-GB'
  
  // Extract country code from locale (e.g., 'en-US' -> 'US')
  const countryCode = locale.split('-')[1]?.toUpperCase()
  
  if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
    const currencyCode = COUNTRY_TO_CURRENCY[countryCode]
    return CURRENCIES[currencyCode]
  }
  
  // Default to GBP
  return CURRENCIES.GBP
}

/**
 * Format price for display
 */
export function formatPrice(currency: CurrencyConfig): string {
  return currency.displayAmount
}

/**
 * Get currency for Stripe checkout
 */
export function getCurrencyForStripe(currencyCode: string): CurrencyConfig {
  return CURRENCIES[currencyCode.toUpperCase()] || CURRENCIES.GBP
}
