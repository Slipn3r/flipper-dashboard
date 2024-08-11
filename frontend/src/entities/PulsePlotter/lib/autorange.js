/* eslint-disable camelcase */
/**
    Determine divisor and SI prefix.

    @author Christian W. Zuckschwerdt <zany@triq.net>
    @copyright Christian W. Zuckschwerdt, 2019
    @license
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
*/

const autoranges = [
  { name: 'yotta', scale: 1e24, prefix: 'Y' },
  { name: 'zetta', scale: 1e21, prefix: 'Z' },
  { name: 'exa', scale: 1e18, prefix: 'E' },
  { name: 'peta', scale: 1e15, prefix: 'P' },
  { name: 'tera', scale: 1e12, prefix: 'T' },
  { name: 'giga', scale: 1e9, prefix: 'G' },
  { name: 'mega', scale: 1e6, prefix: 'M' },
  { name: 'kilo', scale: 1e3, prefix: 'k' },
  { name: '', scale: 1, prefix: '' },
  { name: 'milli', scale: 1e-3, prefix: 'm' },
  { name: 'micro', scale: 1e-6, prefix: 'µ' },
  { name: 'nano', scale: 1e-9, prefix: 'n' },
  { name: 'pico', scale: 1e-12, prefix: 'p' },
  { name: 'femto', scale: 1e-15, prefix: 'f' },
  { name: 'atto', scale: 1e-18, prefix: 'a' },
  { name: 'zepto', scale: 1e-21, prefix: 'z' },
  { name: 'yocto', scale: 1e-24, prefix: 'y' }
]

/** Determine divisor and SI prefix. */
function autorange (num, min_int = 10.0) {
  if (num === 0.0) {
    return autoranges[8]
  }

  num = num / min_int
  for (let i = 0; i < autoranges.length; ++i) {
    if (num >= autoranges[i].scale) {
      return autoranges[i]
    }
  }
  return autoranges[autoranges.length - 1]
}

export { autorange }

const autoranges_time = [
  { name: 'year', scale: 31557513, prefix: 'Y' },
  { name: 'month', scale: 2635200, prefix: 'M' },
  { name: 'day', scale: 86400, prefix: 'D' },
  { name: 'hour', scale: 3600, prefix: 'h' },
  { name: 'minute', scale: 60, prefix: 'm' },
  { name: 'second', scale: 1, prefix: 's' },
  { name: 'milli', scale: 1e-3, prefix: 'ms' },
  { name: 'micro', scale: 1e-6, prefix: 'µs' },
  { name: 'nano', scale: 1e-9, prefix: 'ns' },
  { name: 'pico', scale: 1e-12, prefix: 'ps' },
  { name: 'femto', scale: 1e-15, prefix: 'fs' },
  { name: 'atto', scale: 1e-18, prefix: 'as' },
  { name: 'zepto', scale: 1e-21, prefix: 'zs' },
  { name: 'yocto', scale: 1e-24, prefix: 'ys' }
]

/** Determine SI divisor or Sexagesimal multiplier and suffix. */
function autorange_time (num, min_int = 10.0) {
  if (num === 0.0) {
    return autoranges_time[8]
  }

  num = num / min_int
  for (let i = 0; i < autoranges_time.length; ++i) {
    if (num >= autoranges_time[i].scale) {
      return autoranges_time[i]
    }
  }
  return autoranges_time[autoranges_time.length - 1]
}

export { autorange_time }
