'use client'

// PromoBanner disabled - launch offer ended
interface PromoBannerProps {
  variant?: 'homepage' | 'dashboard'
  onClose?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- props kept for interface compatibility; component is disabled
export default function PromoBanner({ variant, onClose }: PromoBannerProps) {
  // Promo banner disabled
  return null
}
