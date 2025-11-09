'use client'

// PromoBanner disabled - launch offer ended
interface PromoBannerProps {
  variant?: 'homepage' | 'dashboard'
  onClose?: () => void
}

export default function PromoBanner({ variant = 'homepage', onClose }: PromoBannerProps) {
  // Promo banner disabled
  return null
}
