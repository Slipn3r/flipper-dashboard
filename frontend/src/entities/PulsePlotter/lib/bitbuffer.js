/**
    @file Bitbuffer JS.

    @author Christian W. Zuckschwerdt <zany@triq.net>
    @copyright Christian W. Zuckschwerdt, 2020
    @license
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
*/

// function dec2hex(i) {
//    return (i + 0x100).toString(16).substr(-2).toUpperCase()
// }

export class Bitbuffer {
  constructor (bytes = [], len = 0) {
    if (Array.isArray(bytes)) {
      this.bytes = bytes
      this.len = len || bytes.length * 8
    } else {
      this.fromString(bytes)
    }
  }

  fromString (s) {
    this.bytes = []
    this.len = 0
    let len = -1
    s = s.trim()
    // parse length
    if (s.startsWith('{')) {
      const end = s.indexOf('}')
      if (end < 0) return
      len = parseInt(s.slice(1), 10)
      s = s.slice(end + 1)
    }
    // skip 0x prefix
    if (s.startsWith('0x')) {
      s = s.slice(2)
    }
    // parse nibbles
    for (const c of s) {
      const n = parseInt(c, 16)
      this.pushNibble(n)
    }
    // set length if given
    if (len >= 0) {
      this.len = len
    }
  }

  pushZero () {
    this.push(0)
  }

  pushOne () {
    this.push(1)
  }

  pushSymbol (s) {
    if (s === '0') {
      this.push(0)
    } else if (s === '1') {
      this.push(1)
    }
  }

  push (bit) {
    bit = bit ? 0x80 : 0
    this.bytes[~~(this.len / 8)] |= bit >> this.len % 8
    this.len += 1
  }

  pushNibble (n) {
    for (let j = 3; j >= 0; --j) {
      this.push((n >> j) & 1)
    }
  }

  pushByte (n) {
    for (let j = 7; j >= 0; --j) {
      this.push((n >> j) & 1)
    }
  }

  pushBreak () {
    const b = ~~((this.len + 7) / 8)
    this.bytes[b] = -1
    this.len = (b + 1) * 8
  }

  toBitArray () {
    const bits = []
    for (let j = 0; j < this.len; ++j) {
      const byte = this.bytes[~~(j / 8)] || 0
      const bit = (byte >> (7 - (j % 8))) & 1
      bits.push(bit)
    }
    return bits
  }

  toHexString () {
    let s = `{${this.len}}`
    for (let j = 0; j < this.len; j += 8) {
      const b = this.bytes[~~(j / 8)] || 0
      if (b < 0) {
        s += ' / '
      } else {
        s += ' '
        s += (b >> 4).toString(16).toUpperCase()
        if (j + 4 < this.len) {
          s += (b & 0xf).toString(16).toUpperCase()
        }
      }
    }
    return s
  }
}
