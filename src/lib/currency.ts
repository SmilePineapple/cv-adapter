/**
 * Multi-currency support for international users
 */

export interface CurrencyConfig {
  code: string
  symbol: string
  amount: number // Monthly amount in smallest unit (e.g., pence, cents)
  displayAmount: string
  annualAmount: number // Annual amount in smallest unit
  annualDisplayAmount: string
  annualMonthlyEquivalent: string // e.g., "£4.08/month"
  annualSavings: string // e.g., "Save £70/year"
  name: string
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  GBP: {
    code: 'gbp',
    symbol: '£',
    amount: 999, // £9.99/month
    displayAmount: '£9.99',
    annualAmount: 4900, // £49/year
    annualDisplayAmount: '£49',
    annualMonthlyEquivalent: '£4.08/month',
    annualSavings: 'Save £70/year',
    name: 'British Pound'
  },
  USD: {
    code: 'usd',
    symbol: '$',
    amount: 1299, // $12.99/month
    displayAmount: '$12.99',
    annualAmount: 6900, // $69/year
    annualDisplayAmount: '$69',
    annualMonthlyEquivalent: '$5.75/month',
    annualSavings: 'Save $87/year',
    name: 'US Dollar'
  },
  EUR: {
    code: 'eur',
    symbol: '€',
    amount: 1099, // €10.99/month
    displayAmount: '€10.99',
    annualAmount: 5900, // €59/year
    annualDisplayAmount: '€59',
    annualMonthlyEquivalent: '€4.92/month',
    annualSavings: 'Save €73/year',
    name: 'Euro'
  },
  CAD: {
    code: 'cad',
    symbol: 'C$',
    amount: 1499, // C$14.99/month
    displayAmount: 'C$14.99',
    annualAmount: 7900, // C$79/year
    annualDisplayAmount: 'C$79',
    annualMonthlyEquivalent: 'C$6.58/month',
    annualSavings: 'Save C$101/year',
    name: 'Canadian Dollar'
  },
  AUD: {
    code: 'aud',
    symbol: 'A$',
    amount: 1599, // A$15.99/month
    displayAmount: 'A$15.99',
    annualAmount: 8900, // A$89/year
    annualDisplayAmount: 'A$89',
    annualMonthlyEquivalent: 'A$7.42/month',
    annualSavings: 'Save A$103/year',
    name: 'Australian Dollar'
  },
  INR: {
    code: 'inr',
    symbol: '₹',
    amount: 99900, // ₹999/month
    displayAmount: '₹999',
    annualAmount: 499900, // ₹4,999/year
    annualDisplayAmount: '₹4,999',
    annualMonthlyEquivalent: '₹416/month',
    annualSavings: 'Save ₹7,000/year',
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
