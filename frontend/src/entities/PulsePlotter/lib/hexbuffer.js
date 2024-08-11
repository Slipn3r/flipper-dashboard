/**
    @file Hexbuffer JS.

    @author Christian W. Zuckschwerdt <zany@triq.net>
    @copyright Christian W. Zuckschwerdt, 2020
    @license
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
*/

function dec2hex (i, w = 2) {
  return (i + 0x10000).toString(16).substr(-w).toUpperCase().replaceAll('.', '')
}

export class Hexbuffer {
  constructor (line = '') {
    this.fromString(line)
  }

  fromString (s) {
    this.line = s.replace(/\s/g, '')
    this.index = 0
  }

  hasNibble () {
    return this.index + 1 <= this.line.length
  }

  hasByte () {
    return this.index + 2 <= this.line.length
  }

  hasWord () {
    return this.index + 4 <= this.line.length
  }

  peekNibble () {
    return parseInt(this.line.substr(this.index, 1), 16)
  }

  peekByte () {
    return parseInt(this.line.substr(this.index, 2), 16)
  }

  peekWord () {
    return parseInt(this.line.substr(this.index, 4), 16)
  }

  getNibble () {
    const r = parseInt(this.line.substr(this.index, 1), 16)
    this.index += 1
    return r
  }

  getByte () {
    const r = parseInt(this.line.substr(this.index, 2), 16)
    this.index += 2
    return r
  }

  getWord () {
    const r = parseInt(this.line.substr(this.index, 4), 16)
    this.index += 4
    return r
  }

  pushNibble (v) {
    this.line += dec2hex(v, 1)
  }

  pushByte (v) {
    this.line += dec2hex(v, 2)
  }

  pushWord (v) {
    this.line += dec2hex(v, 4)
  }
}
