import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  lazy?: boolean
}

// Зураг ачаалахгүй бол хоосон хүрээ биш, тайлбартай хүрээ харуулна
export default function ProductImage({ src, alt, className = '', lazy = false }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`product-img img-fallback ${className}`} role="img" aria-label={alt || 'Зураг олдсонгүй'}>
        Зураг олдсонгүй
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`product-img ${className}`}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
