import React from 'react'

export default function AssetSVG ({
  src,
  viewBox,
  aspectRatio,
  title,
  className,
  ...otherProps
}) {
  const xlinkHref = `#${src}`

  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      preserveAspectRatio={aspectRatio || 'xMidYMid'}
      focusable='false'
      aria-hidden={title ? null : true}
      {...otherProps}
    >
      {title && <title>{title}</title>}
      <use xlinkHref={xlinkHref} />
    </svg>
  )
}
