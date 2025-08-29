"use client"

import { useState } from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div<{ $loading?: boolean }>`
  position: relative;
  overflow: hidden;
  background: ${props => props.$loading ? 'var(--light-bg)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Image = styled.img<{ $loaded?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$loaded ? 1 : 0};
`

const Placeholder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: var(--text-primary);
`

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: string
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  fallback = '🖼️'
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <ImageContainer className={className} style={{ width, height }}>
        <Placeholder>{fallback}</Placeholder>
      </ImageContainer>
    )
  }

  return (
    <ImageContainer $loading={!loaded} className={className} style={{ width, height }}>
      {!loaded && <Placeholder>⏳</Placeholder>}
      <Image
        src={src}
        alt={alt}
        $loaded={loaded}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </ImageContainer>
  )
}