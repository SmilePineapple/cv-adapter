import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  CURRENCIES,
  getCurrencyFromLocale,
  formatPrice,
  getCurrencyForStripe,
  detectUserCurrency
} from '../currency'

describe('Currency Module', () => {
  describe('CURRENCIES constant', () => {
    it('should have all required currencies', () => {
      expect(CURRENCIES).toHaveProperty('GBP')
      expect(CURRENCIES).toHaveProperty('USD')
      expect(CURRENCIES).toHaveProperty('EUR')
      expect(CURRENCIES).toHaveProperty('CAD')
      expect(CURRENCIES).toHaveProperty('AUD')
      expect(CURRENCIES).toHaveProperty('INR')
    })

    it('should have correct GBP pricing', () => {
      expect(CURRENCIES.GBP.amount).toBe(299) // £2.99
      expect(CURRENCIES.GBP.annualAmount).toBe(2999) // £29.99
      expect(CURRENCIES.GBP.displayAmount).toBe('£2.99')
      expect(CURRENCIES.GBP.annualDisplayAmount).toBe('£29.99')
      expect(CURRENCIES.GBP.symbol).toBe('£')
    })

    it('should have correct USD pricing', () => {
      expect(CURRENCIES.USD.amount).toBe(399) // $3.99
      expect(CURRENCIES.USD.annualAmount).toBe(3999) // $39.99
      expect(CURRENCIES.USD.displayAmount).toBe('$3.99')
      expect(CURRENCIES.USD.symbol).toBe('$')
    })

    it('should have correct EUR pricing', () => {
      expect(CURRENCIES.EUR.amount).toBe(349) // €3.49
      expect(CURRENCIES.EUR.annualAmount).toBe(3499) // €34.99
      expect(CURRENCIES.EUR.symbol).toBe('€')
    })

    it('should calculate annual savings correctly for GBP', () => {
      const monthlyCost = CURRENCIES.GBP.amount * 12 // 299 * 12 = 3588
      const annualCost = CURRENCIES.GBP.annualAmount // 2999
      const savings = monthlyCost - annualCost // 3588 - 2999 = 589 (£5.89)
      expect(savings).toBeGreaterThan(0)
      expect(CURRENCIES.GBP.annualSavings).toContain('Save')
    })

    it('should have valid currency codes', () => {
      Object.values(CURRENCIES).forEach(currency => {
        expect(currency.code).toMatch(/^[a-z]{3}$/)
        expect(currency.symbol).toBeTruthy()
        expect(currency.amount).toBeGreaterThan(0)
        expect(currency.annualAmount).toBeGreaterThan(0)
      })
    })
  })

  describe('getCurrencyFromLocale', () => {
    beforeEach(() => {
      // Reset navigator mock
      vi.stubGlobal('navigator', {
        language: 'en-GB'
      })
    })

    it('should return GBP for en-GB locale', () => {
      vi.stubGlobal('navigator', { language: 'en-GB' })
      const currency = getCurrencyFromLocale()
      expect(currency.code).toBe('gbp')
      expect(currency.symbol).toBe('£')
    })

    it('should return USD for en-US locale', () => {
      vi.stubGlobal('navigator', { language: 'en-US' })
      const currency = getCurrencyFromLocale()
      expect(currency.code).toBe('usd')
      expect(currency.symbol).toBe('$')
    })

    it('should return EUR for de-DE locale', () => {
      vi.stubGlobal('navigator', { language: 'de-DE' })
      const currency = getCurrencyFromLocale()
      expect(currency.code).toBe('eur')
      expect(currency.symbol).toBe('€')
    })

    it('should return CAD for en-CA locale', () => {
      vi.stubGlobal('navigator', { language: 'en-CA' })
      const currency = getCurrencyFromLocale()
      expect(currency.code).toBe('cad')
      expect(currency.symbol).toBe('C$')
    })

    it('should default to GBP for unknown locale', () => {
      vi.stubGlobal('navigator', { language: 'xx-XX' })
      const currency = getCurrencyFromLocale()
      expect(currency.code).toBe('gbp')
    })

    it('should default to GBP on server side', () => {
      vi.stubGlobal('window', undefined)
      const currency = getCurrencyFromLocale()
      expect(currency.code).toBe('gbp')
    })
  })

  describe('formatPrice', () => {
    it('should format GBP price correctly', () => {
      const formatted = formatPrice(CURRENCIES.GBP)
      expect(formatted).toBe('£2.99')
    })

    it('should format USD price correctly', () => {
      const formatted = formatPrice(CURRENCIES.USD)
      expect(formatted).toBe('$3.99')
    })

    it('should format EUR price correctly', () => {
      const formatted = formatPrice(CURRENCIES.EUR)
      expect(formatted).toBe('€3.49')
    })

    it('should format INR price correctly', () => {
      const formatted = formatPrice(CURRENCIES.INR)
      expect(formatted).toBe('₹249')
    })
  })

  describe('getCurrencyForStripe', () => {
    it('should return correct currency for valid code', () => {
      expect(getCurrencyForStripe('GBP').code).toBe('gbp')
      expect(getCurrencyForStripe('USD').code).toBe('usd')
      expect(getCurrencyForStripe('EUR').code).toBe('eur')
    })

    it('should be case insensitive', () => {
      expect(getCurrencyForStripe('gbp').code).toBe('gbp')
      expect(getCurrencyForStripe('usd').code).toBe('usd')
      expect(getCurrencyForStripe('Eur').code).toBe('eur')
    })

    it('should default to GBP for invalid code', () => {
      expect(getCurrencyForStripe('XXX').code).toBe('gbp')
      expect(getCurrencyForStripe('').code).toBe('gbp')
    })
  })

  describe('detectUserCurrency', () => {
    it('should detect currency from IP API', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ country_code: 'US' })
        })
      ) as any

      const currency = await detectUserCurrency()
      expect(currency.code).toBe('usd')
    })

    it('should default to GBP on API failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('API Error'))) as any

      const currency = await detectUserCurrency()
      expect(currency.code).toBe('gbp')
    })

    it('should handle unknown country codes', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ country_code: 'XX' })
        })
      ) as any

      const currency = await detectUserCurrency()
      expect(currency.code).toBe('gbp')
    })
  })

  describe('Pricing consistency', () => {
    it('should have annual pricing cheaper than 12 months', () => {
      Object.values(CURRENCIES).forEach(currency => {
        const monthlyTotal = currency.amount * 12
        expect(currency.annualAmount).toBeLessThan(monthlyTotal)
      })
    })

    it('should have reasonable discount percentages', () => {
      Object.values(CURRENCIES).forEach(currency => {
        const monthlyTotal = currency.amount * 12
        const discount = ((monthlyTotal - currency.annualAmount) / monthlyTotal) * 100
        expect(discount).toBeGreaterThan(10) // At least 10% discount
        expect(discount).toBeLessThan(30) // Not more than 30% discount
      })
    })

    it('should have all required fields', () => {
      Object.values(CURRENCIES).forEach(currency => {
        expect(currency).toHaveProperty('code')
        expect(currency).toHaveProperty('symbol')
        expect(currency).toHaveProperty('amount')
        expect(currency).toHaveProperty('displayAmount')
        expect(currency).toHaveProperty('annualAmount')
        expect(currency).toHaveProperty('annualDisplayAmount')
        expect(currency).toHaveProperty('annualMonthlyEquivalent')
        expect(currency).toHaveProperty('annualSavings')
        expect(currency).toHaveProperty('name')
      })
    })
  })
})
