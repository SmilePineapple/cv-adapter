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
    amount: 299, // £2.99/month
    displayAmount: '£2.99',
    annualAmount: 2999, // £29.99/year
    annualDisplayAmount: '£29.99',
    annualMonthlyEquivalent: '£2.50/month',
    annualSavings: 'Save £6/year',
    name: 'British Pound'
  },
  USD: {
    code: 'usd',
    symbol: '$',
    amount: 399, // $3.99/month
    displayAmount: '$3.99',
    annualAmount: 3999, // $39.99/year
    annualDisplayAmount: '$39.99',
    annualMonthlyEquivalent: '$3.33/month',
    annualSavings: 'Save $8/year',
    name: 'US Dollar'
  },
  EUR: {
    code: 'eur',
    symbol: '€',
    amount: 349, // €3.49/month
    displayAmount: '€3.49',
    annualAmount: 3499, // €34.99/year
    annualDisplayAmount: '€34.99',
    annualMonthlyEquivalent: '€2.92/month',
    annualSavings: 'Save €7/year',
    name: 'Euro'
  },
  CAD: {
    code: 'cad',
    symbol: 'C$',
    amount: 449, // C$4.49/month
    displayAmount: 'C$4.49',
    annualAmount: 4499, // C$44.99/year
    annualDisplayAmount: 'C$44.99',
    annualMonthlyEquivalent: 'C$3.75/month',
    annualSavings: 'Save C$9/year',
    name: 'Canadian Dollar'
  },
  AUD: {
    code: 'aud',
    symbol: 'A$',
    amount: 499, // A$4.99/month
    displayAmount: 'A$4.99',
    annualAmount: 4999, // A$49.99/year
    annualDisplayAmount: 'A$49.99',
    annualMonthlyEquivalent: 'A$4.17/month',
    annualSavings: 'Save A$10/year',
    name: 'Australian Dollar'
  },
  INR: {
    code: 'inr',
    symbol: '₹',
    amount: 24900, // ₹249/month
    displayAmount: '₹249',
    annualAmount: 249900, // ₹2,499/year
    annualDisplayAmount: '₹2,499',
    annualMonthlyEquivalent: '₹208/month',
    annualSavings: 'Save ₹1,500/year',
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
