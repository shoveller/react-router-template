import React from 'react'

type CustomImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  onLoad?: () => void
  onError?: () => void
}

const CustomImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  loading = 'lazy',
  className = '',
  style = {},
  onClick,
  onLoad,
  onError
}: CustomImageProps) => {
  const imgStyle: React.CSSProperties = {
    ...style
  }

  if (fill) {
    imgStyle.position = 'absolute'
    imgStyle.width = '100%'
    imgStyle.height = '100%'
    imgStyle.objectFit = 'cover'
  }

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src,
    alt,
    width,
    height,
    loading,
    className,
    style: imgStyle,
    onClick,
    onLoad,
    onError,
    fetchPriority: 'auto'
  }

  if (priority) {
    imgProps.fetchPriority = 'high'
  }

  return <img {...imgProps} />
}

export default CustomImage
