/**
    @file Pulse Slicer JS.

    @author Christian W. Zuckschwerdt <zany@triq.net>
    @copyright Christian W. Zuckschwerdt, 2020
    @license
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
*/

import { Bitbuffer } from './bitbuffer.js'

export function sliceGuess (pulses, guess) {
  if (guess.modulation === 'PCM') {
    return slicePCM(pulses, guess)
  } else if (guess.modulation === 'MC') {
    return sliceMC(pulses, guess)
  } else if (guess.modulation === 'PPM') {
    return slicePPM(pulses, guess)
  } else if (guess.modulation === 'PWM') {
    return slicePWM(pulses, guess)
  } else if (guess.modulation === 'DM') {
    return sliceDM(pulses, guess)
  } else if (guess.modulation === 'NRZI') {
    return sliceNRZI(pulses, guess)
  } else if (guess.modulation === 'CMI') {
    return sliceCMI(pulses, guess)
  } else if (guess.modulation === 'PIWM') {
    return slicePIWM(pulses, guess)
  } else {
    return []
  }
}

// returned hints array contains triples of start,end,symbol

/// Pulse-code modulation (PCM)
/// https://en.wikipedia.org/wiki/Pulse-code_modulation
/// either NRZ or RZ
export function slicePCM (pulses, guess) {
  if (!guess.long || guess.long === guess.short) {
    return sliceNRZ(pulses, guess)
  } else {
    return sliceRZ(pulses, guess)
  }
}

/// NRZ(L) NRZL Non-return-to-zero level
/// https://en.wikipedia.org/wiki/Non-return-to-zero
export function sliceNRZ (pulses, guess) {
  const short = guess.short
  const gap = guess.gap

  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  for (let j = 0; j < pulses.length; j += 1) {
    const symbol = 1 - (j % 2) // even: 1, odd: 0
    const w = pulses[j] // mark or space
    if (gap && w > gap) {
      bits.pushBreak()
    } else {
      const cnt = ~~(w / short + 0.5)
      for (let k = 0; k < cnt; ++k) {
        hints.push([x + (w / cnt) * k, x + (w / cnt) * (k + 1), symbol])
        bits.push(symbol)
      }
    }
    x += w
  }

  return { hints, bits }
}

/// Return-to-zero level
/// https://en.wikipedia.org/wiki/Return-to-zero
export function sliceRZ (pulses, guess) {
  const short = guess.short
  const long = guess.long
  const gap = guess.gap

  const shortl = short * 0.5
  const shortu = short * 1.5

  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  for (let j = 0; j < pulses.length; j += 2) {
    const m = pulses[j] // mark
    const s = pulses[j + 1] // space
    if (m < shortl || m > shortu) {
      bits.pushBreak()
      x += m + s
      continue
    }
    let onew = (m * long) / short // estimate the 1-bit width
    let zs = s + m - onew // estimate 0-bits width
    if (zs < long / 2) {
      onew = m + s // no 0-bits
      zs = 0
    }
    hints.push([x, x + onew, '1'])
    bits.pushOne()
    x += onew
    if (gap && s > gap) {
      bits.pushBreak()
      x += zs
      continue
    }
    const cnt = ~~(zs / long + 0.5)
    for (let k = 0; k < cnt; ++k) {
      hints.push([x + (zs * k) / cnt, x + (zs * (k + 1)) / cnt, '0'])
      bits.pushZero()
    }
    x += zs
  }

  return { hints, bits }
}

/// Pulse-position modulation (PPM)
/// https://en.wikipedia.org/wiki/Pulse-position_modulation
export function slicePPM (pulses, guess) {
  const short = guess.short
  const long = guess.long
  const sync = guess.sync
  const gap = guess.gap

  const shortl = short * 0.5
  const shortu = short * 1.5
  const longl = long * 0.5
  const longu = long * 1.5
  const syncl = sync * 0.5
  const syncu = sync * 1.5

  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  for (let j = 0; j < pulses.length; j += 2) {
    const m = pulses[j] // mark
    const s = pulses[j + 1] // space
    const x0 = x
    x += m + s
    if (s > shortl && s < shortu) {
      hints.push([x0, x, '1'])
      bits.pushOne()
    } else if (s > longl && s < longu) {
      hints.push([x0, x, '0'])
      bits.pushZero()
    } else if (s > syncl && s < syncu) {
      hints.push([x0, x, 'X'])
      bits.pushBreak()
    } else if (gap && s > gap) {
      bits.pushBreak()
    }
  }

  return { hints, bits }
}

/// Pulse-width modulation (PWM)
/// https://en.wikipedia.org/wiki/Pulse-width_modulation
export function slicePWM (pulses, guess) {
  const short = guess.short
  const long = guess.long
  const sync = guess.sync
  const gap = guess.gap

  const shortl = short * 0.5
  const shortu = short * 1.5
  const longl = long * 0.5
  const longu = long * 1.5
  const syncl = sync * 0.5
  const syncu = sync * 1.5

  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  for (let j = 0; j < pulses.length; j += 2) {
    const m = pulses[j] // mark
    const s = pulses[j + 1] // space

    const x0 = x
    let x1 = x + m + s
    // break on gaps
    if (s > gap) {
      x1 = x + m + gap
    }
    x += m + s

    if (m > shortl && m < shortu) {
      hints.push([x0, x1, '1'])
      bits.pushOne()
    } else if (m > longl && m < longu) {
      hints.push([x0, x1, '0'])
      bits.pushZero()
    } else if (m > syncl && m < syncu) {
      hints.push([x0, x1, 'X'])
      bits.pushBreak()
    }
    if (gap && s > gap) {
      bits.pushBreak()
    }
  }

  return { hints, bits }
}

/// get Manchester alignment, 1 if we are at the start of a bit, 0 if we are in the middle
function manchesterAligned (pulses, offset, short) {
  for (let j = offset; j < pulses.length; j += 2) {
    const mw = pulses[j] // mark
    const cw = ~~(mw / short + 0.5)
    if (cw > 1) return 0 // middle
    const sw = pulses[j + 1] // space
    const sc = ~~(sw / short + 0.5)
    if (sc > 1) return 1 // start
  }
  // warning, no alignment found
  return 0
}

/// Manchester code (MC)
/// https://en.wikipedia.org/wiki/Manchester_code
export function sliceMC (pulses, guess) {
  const short = guess.short
  const bits = new Bitbuffer()
  const hints = []

  // Manchester align string by finding the position of the first long pulse or gap
  let aligned = manchesterAligned(pulses, 0, short)

  let x = 0
  let x1 = 0
  for (let j = 0; j < pulses.length; j += 2) {
    const mark = pulses[j] // mark
    const mcnt = ~~(mark / short + 0.5)
    const space = pulses[j + 1] // space
    const scnt = ~~(space / short + 0.5)

    if (mcnt === 1) {
      if (!aligned) {
        hints.push([x1, x + mark, '0'])
        bits.pushZero()
        x1 = x + mark
      } else {
        // aligned
        x1 = x
      }
      aligned = !aligned
    } else if (mcnt === 2) {
      if (!aligned) {
        hints.push([x1, x + mark / 2, '0'])
        bits.pushZero()
        x1 = x + mark / 2
      } else {
        // aligned
        // error
        bits.pushBreak()
        x1 = x + mark / 2
      }
      aligned = false
    } else if (mcnt > 2) {
      if (!aligned) {
        hints.push([x1, x + mark / mcnt, '0'])
        bits.pushZero()
        x1 = x + mark - mark / mcnt
      } else {
        // aligned
        // error
        x1 = x + mark - mark / mcnt
      }
      bits.pushBreak()
      aligned = manchesterAligned(pulses, j + 1, short)
    }

    if (scnt === 1) {
      if (!aligned) {
        hints.push([x1, x + mark + space, '1'])
        bits.pushOne()
        x1 = x + mark + space
      } else {
        // aligned
        x1 = x + mark
      }
      aligned = !aligned
    } else if (scnt === 2) {
      if (!aligned) {
        hints.push([x1, x + mark + space / 2, '1'])
        bits.pushOne()
        x1 = x + mark + space / 2
      } else {
        // aligned
        // error
        bits.pushBreak()
        x1 = x + mark + space / 2
      }
      aligned = false
    } else if (scnt > 2) {
      if (!aligned) {
        hints.push([x1, x + mark + space / scnt, '1'])
        bits.pushOne()
        x1 = x + mark + space - space / scnt
      } else {
        // aligned
        // error
        x1 = x + mark + space - space / scnt
      }
      bits.pushBreak()
      aligned = manchesterAligned(pulses, j + 1, short)
    }

    x += mark + space
  }

  return { hints, bits }
}

/// Differential Manchester Encoding (DM) aka Biphase Mark Code (CC)
/// https://en.wikipedia.org/wiki/Differential_Manchester_encoding
export function sliceDM (pulses, guess) {
  const short = guess.short
  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  let x1 = null
  for (let j = 0; j < pulses.length; j += 2) {
    const mark = pulses[j] // mark
    const mcnt = ~~(mark / short + 0.5)
    const space = pulses[j + 1] // space
    const scnt = ~~(space / short + 0.5)

    if (!x1 && mcnt === 1 && scnt === 1) {
      hints.push([x, x + mark + space, '0'])
      bits.pushZero()
    } else if (mcnt === 1 && scnt === 1) {
      hints.push([x1, x + mark, '0'])
      bits.pushZero()
      x1 = x + mark
    } else if (x1 && mcnt === 1 && scnt === 2) {
      hints.push([x1, x + mark, '0'])
      bits.pushZero()
      hints.push([x + mark, x + mark + space, '1'])
      bits.pushOne()
      x1 = null
    } else if (mcnt === 2 && scnt === 1) {
      hints.push([x, x + mark, '1'])
      bits.pushOne()
      x1 = x + mark
    } else if (mcnt === 2 && scnt === 2) {
      hints.push([x, x + mark, '1'])
      bits.pushOne()
      hints.push([x + mark, x + mark + space, '1'])
      bits.pushOne()
    } else if (!x1 && mcnt === 1) {
      // error
      hints.push([x, x + mark + short, '0'])
      bits.pushZero()
      bits.pushBreak()
    } else if (!x1 && mcnt === 2) {
      // error
      hints.push([x, x + mark, '1'])
      bits.pushOne()
      bits.pushBreak()
    } else {
      // error (!x1 && mcnt === 1 && scnt === 2)
      if (x1) {
        hints.push([x1, x1 + short * 2, '0'])
        bits.pushZero()
      }
      x1 = null
      bits.pushBreak()
    }
    x += mark + space
  }

  return { hints, bits }
}

/// Non-return-to-zero, inverted (NRZI) https://en.wikipedia.org/wiki/Non-return-to-zero#NRZI
/// NRZ(I) NRZI Non-return-to-zero inverted Refers to either an NRZ(M) or NRZ(S) code.
/// NRZ(M) NRZM Non-return-to-zero mark Serializer mapping {0: constant, 1: toggle}.
/// NRZ(S) NRZS Non-return-to-zero space Serializer mapping {0: toggle, 1: constant}.
/// A 1 is transmitted as a transition, and a 0 is transmitted as no transition.
export function sliceNRZI (pulses, guess) {
  const short = guess.short
  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  let x1 = 0
  for (let j = 0; j < pulses.length; j += 1) {
    const w = pulses[j] // mark or space
    const cnt = ~~(w / short + 0.5)
    // every edge is a 1, don't use the first edge
    if (x1) {
      hints.push([x1, x + short / 2, '1'])
      bits.pushOne()
    }
    x1 = x + short / 2
    // count minus one amounts of 0
    for (let k = 1; k < cnt; ++k) {
      hints.push([x1, x1 + w / cnt, '0'])
      bits.pushZero()
      x1 += w / cnt
    }
    x += w
  }

  return { hints, bits }
}

/// Coded Mark Inversion (CMI) https://en.wikipedia.org/wiki/Coded_mark_inversion
/// encodes zero bits as a half bit time of zero followed by a half bit time of one,
/// and one bits are encoded as a full bit time of a constant level,
/// the level used for one bits alternates each time one is coded.
export function sliceCMI (pulses, guess) {
  const short = guess.short
  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  let x1 = null
  for (let j = 0; j < pulses.length; j += 2) {
    const mark = pulses[j] // mark
    const mcnt = ~~(mark / short + 0.5)
    const space = pulses[j + 1] // space
    const scnt = ~~(space / short + 0.5)

    if (mcnt === 1 && scnt === 1) {
      if (!x1) x1 = x - mark // first bit
      hints.push([x1, x + mark, '0'])
      bits.pushZero()
      x1 = x + mark
    } else if (mcnt === 1 && scnt === 2) {
      if (!x1) x1 = x - mark // first bit
      hints.push([x1, x + mark, '0'])
      bits.pushZero()
      x1 = x + mark + space
      hints.push([x + mark, x1, '1'])
      bits.pushOne()
    } else if (mcnt === 1 && scnt === 3) {
      if (!x1) x1 = x - mark // first bit
      hints.push([x1, x + mark, '0'])
      bits.pushZero()
      x1 = x + mark + (space * 2) / 3
      hints.push([x + mark, x1, '1'])
      bits.pushOne()
    } else if (mcnt === 2 && scnt === 1) {
      hints.push([x1, x + mark, '1'])
      bits.pushOne()
      x1 = x + mark
    } else if (mcnt === 2 && scnt === 2) {
      hints.push([x1, x + mark, '1'])
      bits.pushOne()
      x1 = x + mark + space
      hints.push([x + mark, x1, '1'])
      bits.pushOne()
    } else if (mcnt === 2 && scnt === 3) {
      hints.push([x1, x + mark, '1'])
      bits.pushOne()
      x1 = x + mark + (space * 2) / 3
      hints.push([x + mark, x1, '1'])
      bits.pushOne()
    } else if (mcnt === 3 && scnt === 1) {
      hints.push([x1, x + mark / 3, '0'])
      bits.pushZero()
      hints.push([x + mark / 3, x + mark, '1'])
      bits.pushOne()
      x1 = x + mark
    } else if (mcnt === 3 && scnt === 2) {
      hints.push([x1, x + mark / 3, '0'])
      bits.pushZero()
      hints.push([x + mark / 3, x + mark, '1'])
      bits.pushOne()
      x1 = x + mark + space
      hints.push([x + mark, x1, '1'])
      bits.pushOne()
    } else if (mcnt === 3 && scnt === 3) {
      hints.push([x1, x + mark / 3, '0'])
      bits.pushZero()
      hints.push([x, x + mark / 3, '1'])
      bits.pushOne()
      hints.push([x + mark / 3, x + mark, '1'])
      bits.pushOne()
      hints.push([x + mark, x + mark + (space * 3) / 2, '1'])
      bits.pushOne()
      x1 = x + mark + (space * 3) / 2
    } else if (mcnt === 1) {
      // last zero
      hints.push([x1, x + mark, '0'])
      bits.pushZero()
      bits.pushBreak()
      x1 = x + mark
    } else if (mcnt === 2) {
      // last one
      hints.push([x1, x + mark, '1'])
      bits.pushOne()
      bits.pushBreak()
      x1 = x + mark
    } else {
      // error
      bits.pushBreak()
    }
    x += mark + space
  }

  return { hints, bits }
}

/// Pulse-Interval-Width Modulation (PIWM)
/// Exotic differential coding
export function slicePIWM (pulses, guess) {
  const short = guess.short
  const bits = new Bitbuffer()
  const hints = []

  let x = 0
  for (let j = 0; j < pulses.length; j += 1) {
    const w = pulses[j] // mark or space
    const cnt = ~~(w / short + 0.5)

    if (cnt === 1) {
      hints.push([x, x + w, '1'])
      bits.pushOne()
    } else if (cnt === 2) {
      hints.push([x, x + w, '0'])
      bits.pushZero()
    } else {
      // error
      bits.pushBreak()
    }
    x += w
  }

  return { hints, bits }
}
