'use client'

import { useState } from 'react'

interface ClientImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export default function ClientImage({ src, alt, className, fallbackSrc }: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
} 