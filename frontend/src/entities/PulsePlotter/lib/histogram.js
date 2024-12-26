/* eslint-disable camelcase */
/**
    @file Histogram JS.

    @author Christian W. Zuckschwerdt <zany@triq.net>
    @copyright Christian W. Zuckschwerdt, 2020
    @license
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
*/

import { Hexbuffer } from './hexbuffer.js'

/* eslint no-console: "off" */

const max_hist_bins = 16

/// Histogram data for single bin
class Bin {
  constructor (num) {
    if (typeof num !== 'undefined') {
      this.count = 1
      this.sum = num
      this.mean = num
      this.devi = 0
      this.min = num
      this.max = num
    } else {
      this.count = 0
      this.sum = 0
      this.mean = null
      this.devi = 0
      this.min = null
      this.max = null
    }
  }

  add (num) {
    this.count++
    this.sum += num
    this.mean = this.sum / this.count
    this.min = this.min === null ? num : Math.min(num, this.min)
    this.max = this.max === null ? num : Math.max(num, this.max)
    this.devi = (this.max - this.min) / 2
  }

  fuse (bin) {
    this.count += bin.count
    this.sum += bin.sum
    this.mean = this.sum / this.count
    this.min = Math.min(this.min, bin.min)
    this.max = Math.max(this.max, bin.max)
    this.devi = (this.max - this.min) / 2
  }

  contains (num) {
    return num >= this.min && num <= this.max
  }
}

/// Histogram data for all bins
export class Histogram {
  constructor (data, tolerance = 0.2) {
    this.bins = []
    this.histogram_sum(data, tolerance)
  }

  get length () {
    return this.bins.length
  }

  /// Generate a histogram (unsorted)
  histogram_sum (data, tolerance = 0.2) {
    const len = data.length
    for (let n = 0; n < len; ++n) {
      // Search for match in existing bins
      let bin
      for (bin = 0; bin < this.bins.length; ++bin) {
        const bn = data[n]
        const bm = this.bins[bin].mean
        if (Math.abs(bn - bm) < tolerance * Math.max(bn, bm)) {
          this.bins[bin].add(data[n])
          break // Match found! Data added to existing bin
        }
      }
      // No match found? Add new bin
      if (bin === this.bins.length && bin < max_hist_bins) {
        this.bins.push(new Bin(data[n]))
      }
    }
  }

  /// Delete bin from histogram
  delete_bin (index) {
    this.bins.splice(index, 1)
  }

  /// Swap two bins in histogram
  swap_bins (index1, index2) {
    if (index1 < this.bins.length && index2 < this.bins.length) {
      // Avoid out of bounds
      const tempbin = this.bins[index1]
      this.bins[index1] = this.bins[index2]
      this.bins[index2] = tempbin
    }
  }

  /// Sort histogram with mean value (order lowest to highest)
  sort_mean () {
    if (this.bins.length < 2) return // Avoid underflow
    // Compare all bins (bubble sort)
    for (let n = 0; n < this.bins.length - 1; ++n) {
      for (let m = n + 1; m < this.bins.length; ++m) {
        if (this.bins[m].mean < this.bins[n].mean) {
          this.swap_bins(m, n)
        }
      }
    }
  }

  /// Sort histogram with count value (order lowest to highest)
  sort_count () {
    if (this.bins.length < 2) return // Avoid underflow
    // Compare all bins (bubble sort)
    for (let n = 0; n < this.bins.length - 1; ++n) {
      for (let m = n + 1; m < this.bins.length; ++m) {
        if (this.bins[m].count < this.bins[n].count) {
          this.swap_bins(m, n)
        }
      }
    }
  }

  /// Fuse histogram bins with means within tolerance
  fuse_bins (tolerance = 0.2) {
    if (this.bins.length < 2) return // Avoid underflow
    // Compare all bins
    for (let n = 0; n < this.bins.length - 1; ++n) {
      for (let m = n + 1; m < this.bins.length; ++m) {
        const bn = this.bins[n].mean
        const bm = this.bins[m].mean
        // if within tolerance
        if (Math.abs(bn - bm) < tolerance * Math.max(bn, bm)) {
          // Fuse data for bin[n] and bin[m]
          this.bins[n].fuse(this.bins[m])
          // Delete bin[m]
          this.delete_bin(m)
          m-- // Compare new bin in same place!
        }
      }
    }
  }

  /// Trim zero-width bins
  trim_bins (tolerance = 0) {
    for (let n = 0; n < this.bins.length; ++n) {
      // if within tolerance
      if (this.bins[n].mean <= tolerance) {
        // Delete bin[n]
        this.delete_bin(n)
      }
    }
  }

  /// Find bin index
  find_bin_index (width) {
    for (let n = 0; n < this.bins.length; ++n) {
      if (this.bins[n].contains(width)) {
        return n
      }
    }
    return -1
  }

  /// Print a histogram
  console_print () {
    for (let n = 0; n < this.bins.length; ++n) {
      const b = this.bins[n]
      console.log(
        `[${n}] ${b.count} × ${b.mean.toFixed(1)} ±${b.devi.toFixed(1)} µs [${
          b.min
        };${b.max}]`
      )
    }
  }

  string_print (separator = ', ') {
    const ret = []
    for (let n = 0; n < this.bins.length; ++n) {
      const b = this.bins[n]
      ret.push(
        `${b.count}× ${b.mean.toFixed(1)} <small>±${b.devi.toFixed(
          1
        )}</small> µs`
      )
    }
    return ret.join(separator)
  }
}

export class Analyzer {
  constructor (data, tolerance = 0.2) {
    this.analyse_pulses(data, tolerance)
    this.create_rfraw(data)
  }

  /// Create histograms from pulse data
  analyse_pulses (data, messages, tolerance = 0.2) {
    // Generate pulse/gap/period data
    this.pulses = []
    this.gaps = []
    this.periods = []
    this.pulse_sum = 0
    this.gap_sum = 0
    // Leave out last gap (end)
    for (let j = 0; j < data.length - 2; j += 2) {
      const m = data[j] // mark
      const s = data[j + 1] // space
      this.pulses.push(m)
      this.gaps.push(s)
      this.periods.push(m + s)
      this.pulse_sum += m
      this.gap_sum += s
    }
    const m = data[data.length - 2] // last mark
    // const s = data[data.length - 1] // last space
    this.pulses.push(m)
    this.pulse_sum += m
    // this.gap_sum += s
    this.pulse_gap_ratio = this.pulse_sum / this.gap_sum
    this.pulse_gap_skew = this.pulse_gap_ratio - 1

    // Generate statistics
    this.hist_pulses = new Histogram(this.pulses, tolerance)
    this.hist_gaps = new Histogram(this.gaps, tolerance)
    this.hist_periods = new Histogram(this.periods, tolerance)
    this.hist_timings = new Histogram(data, tolerance)

    // Trim zero-width bins
    this.hist_pulses.trim_bins(tolerance)
    this.hist_gaps.trim_bins(tolerance)
    this.hist_periods.trim_bins(tolerance)
    this.hist_timings.trim_bins(tolerance)

    // Fuse overlapping bins
    this.hist_pulses.fuse_bins(tolerance)
    this.hist_gaps.fuse_bins(tolerance)
    this.hist_periods.fuse_bins(tolerance)
    this.hist_timings.fuse_bins(tolerance)
  }

  guess () {
    const pulses = this.hist_pulses
    const gaps = this.hist_gaps
    const periods = this.hist_periods
    pulses.sort_mean() // Easier to work with sorted data
    gaps.sort_mean()
    if (pulses.bins.length > 0 && pulses.bins[0].mean === 0) {
      pulses.delete_bin(0) // Remove FSK initial zero-bin
    }
    // if (pulses.bins[0].mean <= 9 && pulses.bins[0].count <= 2) {
    //    pulses.delete_bin(0) // Remove stray pulses
    // }

    // Attempt to find a matching modulation
    // console.log(`${pulses.length} ${gaps.length} ${periods.length}`)
    if (this.pulses.length === 1) {
      return {
        name: 'Single pulse detected. Probably Frequency Shift Keying or just noise...'
      }
    } else if (pulses.length === 1 && gaps.length === 1) {
      return {
        name: 'Un-modulated signal. Maybe a preamble...'
      }
    } else if (pulses.length === 1 && gaps.length > 1) {
      return {
        name: 'Pulse Position Modulation with fixed pulse width',
        modulation: 'PPM',
        short: gaps.bins[0].mean,
        long: gaps.bins[1].mean,
        gap: gaps.bins[1].max * 1.2, // Set limit above next lower gap
        reset: gaps.bins[gaps.length - 1].max * 1.2 // Set limit above biggest gap
      }
    } else if (pulses.length === 2 && gaps.length === 1) {
      const short = pulses.bins[0].mean
      const long = pulses.bins[1].mean
      return {
        name: 'Pulse Width Modulation with fixed gap',
        modulation: 'PWM',
        short: short,
        long: long,
        tolerance: (long - short) * 0.4,
        reset: gaps.bins[gaps.length - 1].max * 1.2 // Set limit above biggest gap
      }
    } else if (
      pulses.length === 2 &&
      gaps.length === 2 &&
      periods.length === 1
    ) {
      const short = pulses.bins[0].mean
      const long = pulses.bins[1].mean
      return {
        name: 'Pulse Width Modulation with fixed period',
        modulation: 'PWM',
        short: short,
        long: long,
        tolerance: (long - short) * 0.4,
        reset: gaps.bins[gaps.length - 1].max * 1.2 // Set limit above biggest gap
      }
    } else if (
      pulses.length === 2 &&
      gaps.length === 2 &&
      periods.length === 3
    ) {
      const short = pulses.bins[0].mean
      return {
        name: 'Manchester coding (PCM)',
        modulation: 'MC',
        short: short, // Assume shortest pulse is half period
        long: short, // Not used
        reset: gaps.bins[gaps.length - 1].max * 1.2 // Set limit above biggest gap
      }
    } else if (pulses.length === 2 && gaps.length >= 3) {
      const short = pulses.bins[0].mean
      const long = pulses.bins[1].mean
      return {
        name: 'Pulse Width Modulation with multiple packets',
        modulation: 'PWM',
        short: short,
        long: long,
        gap: gaps.bins[1].max * 1.2, // Set limit above second gap
        tolerance: (long - short) * 0.4,
        reset: gaps.bins[gaps.length - 1].max * 1.2 // Set limit above biggest gap
      }
    } else if (
      pulses.length >= 3 &&
      gaps.length >= 3 &&
      Math.abs(pulses.bins[1].mean - 2 * pulses.bins[0].mean) <=
        pulses.bins[0].mean / 8 && // Pulses are multiples of shortest pulse
      Math.abs(pulses.bins[2].mean - 3 * pulses.bins[0].mean) <=
        pulses.bins[0].mean / 8 &&
      Math.abs(gaps.bins[0].mean - pulses.bins[0].mean) <=
        pulses.bins[0].mean / 8 && // Gaps are multiples of shortest pulse
      Math.abs(gaps.bins[1].mean - 2 * pulses.bins[0].mean) <=
        pulses.bins[0].mean / 8 &&
      Math.abs(gaps.bins[2].mean - 3 * pulses.bins[0].mean) <=
        pulses.bins[0].mean / 8
    ) {
      return {
        name: 'Pulse Code Modulation (Not Return to Zero)',
        modulation: 'PCM',
        short: pulses.bins[0].mean, // Shortest pulse is bit width
        long: pulses.bins[0].mean, // Bit period equal to pulse length (NRZ)
        reset: pulses.bins[0].mean * 1024 // No limit to run of zeros...
      }
    } else if (pulses.length === 3) {
      // Re-sort to find lowest pulse count index (is probably delimiter)
      pulses.sort_count()
      const p1 = pulses.bins[1].mean
      const p2 = pulses.bins[2].mean
      const short = p1 < p2 ? p1 : p2 // Set to shorter pulse width
      const long = p1 < p2 ? p2 : p1 // Set to longer pulse width
      return {
        name: 'Pulse Width Modulation with sync/delimiter',
        modulation: 'PWM',
        short: short,
        long: long,
        sync: pulses.bins[0].mean, // Set to lowest count pulse width
        reset: gaps.bins[gaps.length - 1].max * 1.2 // Set limit above biggest gap
      }
    } else {
      return {
        name: 'No clue...'
      }
    }
  }

  create_rfraw (data) {
    const timings = this.hist_timings

    if (timings.bins.length < 1) {
      return ''
    }
    if (timings.bins.length > 8) {
      return ''
    }
    if (data.length > 494) {
      return ''
    }

    const raw = new Hexbuffer()

    for (const b of timings.bins) {
      raw.pushWord(b.mean)
    }

    for (let j = 0; j < data.length - 1; j += 2) {
      const m = data[j] // mark
      const s = data[j + 1] // space
      const mi = timings.find_bin_index(m)
      const si = timings.find_bin_index(s)
      raw.pushNibble(mi | 8)
      raw.pushNibble(si)
    }

    raw.pushByte(0x55)

    const raw0 = new Hexbuffer()
    raw0.pushByte(0xaa)
    raw0.pushByte(0xb0)
    raw0.pushByte(2 + raw.line.length / 2 - 1)
    raw0.pushByte(timings.bins.length)
    raw0.pushByte(1) // repeats

    const raw1 = new Hexbuffer()
    raw1.pushByte(0xaa)
    raw1.pushByte(0xb1)
    raw1.pushByte(timings.bins.length)

    this.rfrawB0 = raw0.line + raw.line
    this.rfrawB1 = raw1.line + raw.line
  }

  console_log () {
    /* const guess = this.guess()
    console.log('Analyzing pulses...')
    console.log(`Total count: ${this.pulses.length}`)
    console.log('Pulse width distribution:')
    this.hist_pulses.console_print()
    console.log('Gap width distribution:')
    this.hist_gaps.console_print()
    console.log('Pulse period distribution:')
    this.hist_periods.console_print()
    console.log('Pulse timing distribution:')
    this.hist_timings.console_print()
    console.log(`DC bias (Pulse/Gap skew): ${(this.pulse_gap_skew * 100).toFixed(1)}`)
    console.log('Guessing modulation:')
    console.log(guess) */
  }

  print_plain (messages) {
    const guess = this.guess()
    messages.innerHTML = `
        <div>Pulses: ${this.hist_pulses.string_print()}</div>
        <div>Gaps: ${this.hist_gaps.string_print()}</div>
        <div>Periods: ${this.hist_periods.string_print()}</div>
        <div>Timings: ${this.hist_timings.string_print()}</div>
        <div>${guess.name}</div>
        `
  }

  /*
const locale = new Intl.NumberFormat().resolvedOptions().locale
const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay: 'exceptZero',
    maximumFractionDigits: 1,
})
formatter.format(0.5)
*/
  print (timings, messages) {
    const guess = this.guess()
    if (timings) {
      timings.innerHTML = `<table>
            <tr><th align="left">Pulses</th><td>${this.hist_pulses.string_print(
              '</td><td>'
            )}</td></tr>
            <tr><th align="left">Gaps</th><td>${this.hist_gaps.string_print(
              '</td><td>'
            )}</td></tr>
            <tr><th align="left">Periods</th><td>${this.hist_periods.string_print(
              '</td><td>'
            )}</td></tr>
            <tr><th align="left">Timings</th><td>${this.hist_timings.string_print(
              '</td><td>'
            )}</td></tr>
            </table>
            `
    }
    if (messages) {
      messages.innerHTML = `
            <div><small>DC bias (Pulse/Gap skew): ${(
              this.pulse_gap_skew * 100
            ).toFixed(1)}%</small><br>
            Guessing modulation: <strong>${guess.name}</strong><br>
            modulation: <strong>${guess.modulation || 'unknown'}</strong>
            short: <strong>${
              guess.short ? guess.short.toFixed(1) : '-'
            }</strong>
            long: <strong>${guess.long ? guess.long.toFixed(1) : '-'}</strong>
            sync: <strong>${guess.sync ? guess.sync.toFixed(1) : '-'}</strong>
            gap: <strong>${guess.gap ? guess.gap.toFixed(1) : '-'}</strong>
            reset: <strong>${
              guess.reset ? guess.reset.toFixed(1) : '-'
            }</strong><br>
            <small>RfRaw (rx): <strong>${
              this.rfrawB1 ? this.rfrawB1 : '-'
            }</strong></small><br>
            <small>RfRaw (tx): <strong>${
              this.rfrawB0 ? this.rfrawB0 : '-'
            }</strong></small>
            </div>
            `
    }
  }
}
