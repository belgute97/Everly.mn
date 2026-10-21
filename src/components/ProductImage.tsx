import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  lazy?: boolean
}

// Ачаалах үед shimmer, ачаалсны дараа зөөлөн гарч ирнэ. Ачаалахгүй бол тайлбартай хүрээ
export default function ProductImage({ src, alt, className = '', lazy = false }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
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
      className={`product-img ${loaded ? 'is-loaded' : ''} ${className}`}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  )
}
