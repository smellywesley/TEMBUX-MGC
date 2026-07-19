import React from 'react'
import { FONTS, TABULAR } from '../theme/tokens'

// Per-digit vertical roll, tabular numerals, zero layout shift.
// `value` is a continuously-animated number; digits roll through their strip.
export const Odometer: React.FC<{
  value: number
  fontSize: number
  color: string
  suffix?: string
  weight?: number
}> = ({ value, fontSize, color, suffix, weight = 600 }) => {
  const whole = Math.max(0, value)
  const intStr = String(Math.floor(whole))
  const nDigits = intStr.length
  const digitH = fontSize * 1.05

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: FONTS.sans,
        fontWeight: weight,
        fontSize,
        color,
        ...TABULAR,
      }}
    >
      {Array.from({ length: nDigits }).map((_, i) => {
        const place = nDigits - 1 - i
        const digitValue = (whole / 10 ** place) % 10 // continuous 0..10
        // separators: thin-space groups of 3
        const needsComma = place % 3 === 2 && i !== 0
        return (
          <React.Fragment key={i}>
            {needsComma && <span>,</span>}
            <span
              style={{
                display: 'inline-block',
                height: digitH,
                lineHeight: `${digitH}px`,
                overflow: 'hidden',
                width: '0.62em',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'block',
                  transform: `translateY(${-digitValue * digitH}px)`,
                }}
              >
                {Array.from({ length: 11 }).map((_, d) => (
                  <span key={d} style={{ display: 'block', height: digitH, lineHeight: `${digitH}px` }}>
                    {d % 10}
                  </span>
                ))}
              </span>
            </span>
          </React.Fragment>
        )
      })}
      {suffix ? <span style={{ fontSize: fontSize * 0.4, marginLeft: '0.15em' }}>{suffix}</span> : null}
    </span>
  )
}
