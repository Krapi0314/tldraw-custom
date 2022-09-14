import { Utils } from '@krapi0314/tldraw-core'
import Vec from '@tldraw/vec'
import * as React from 'react'
import { getShapeStyle } from '~state/shapes/shared'
import type { ShapeStyles } from '~types'
import { getTrianglePoints } from '../triangleHelpers'

interface TriangleSvgProps {
  id: string
  size: number[]
  style: ShapeStyles
  isSelected: boolean
  isDarkMode: boolean
}

export const DashedTriangle = React.memo(function DashedTriangle({
  id,
  size,
  style,
  isSelected,
  isDarkMode,
}: TriangleSvgProps) {
  const { stroke, strokeWidth, fill } = getShapeStyle(style, isDarkMode)
  const sw = 1 + strokeWidth * 1.618
  const points = getTrianglePoints(size)
  const sides = Utils.pointsToLineSegments(points, true)
  const paths = sides.map(([start, end], i) => {
    const { strokeDasharray, strokeDashoffset } = Utils.getPerfectDashProps(
      Vec.dist(start, end),
      strokeWidth * 1.618,
      style.dash
    )

    return (
      <line
        key={id + '_' + i}
        x1={start[0]}
        y1={start[1]}
        x2={end[0]}
        y2={end[1]}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    )
  })

  const bgPath = points.join()

  return (
    <>
      <polygon
        className={style.isFilled || isSelected ? 'tl-fill-hitarea' : 'tl-stroke-hitarea'}
        points={bgPath}
      />
      {style.isFilled && <polygon fill={fill} points={bgPath} pointerEvents="none" />}
      <g pointerEvents="stroke">{paths}</g>
    </>
  )
})
