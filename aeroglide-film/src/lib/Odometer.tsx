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
        // 'baseline' misaligns against the digit strips (synthetic block
        // elements with no text baseline of their own) and made the suffix
        // glyph (%, N, mm) float and clip oddly. Bottom-align instead.
        alignItems: 'flex-end',
        fontFamily: FONTS.sans,
        fontWeight: weight,
        fontSize,
        color,
        ...TABULAR,
      }}
    >
      {Array.from({ length: nDigits }).map((_, i) => {
        const place = nDigits - 1 - i
        // BUG (fixed): unfloored `(whole / 10**place) % 10` gives a
        // permanently fractional value for every non-last digit whenever the
        // lower digits are nonzero (e.g. 72 -> tens digit 7.2, not 7) — the
        // strip never settles and a sliver of the next digit bleeds through
        // forever. Only the ones digit (place 0) should roll continuously;
        // every other digit must floor to its own integer value.
        const digitValue = place === 0 ? whole % 10 : Math.floor(whole / 10 ** place) % 10
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
