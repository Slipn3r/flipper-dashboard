const defaults = {
  selector: '#flipperPlotter',
  height: 300,
  margin: {
    top: 50,
    right: 0,
    bottom: 50,
    left: 0
  },
  breakpoints: {
    zoom: 10,
    pulseInOneX: 75
  },
  theme: {
    spaceFill: '#fafafa',
    combiningFill: '#e6ecee',
    hiFill: '#e0efe0',
    hiStroke: '#3c3',
    hiLine: 4,
    loStroke: '#c33',
    loLine: 4,
    edgeStroke: '#ccc',
    edgeLine: 1,
    hintLine: 1,
    hintStroke: '#aaf',
    hintDash: [3, 2],
    hintAltLine: 3,
    hintAltStroke: '#c55',
    hintAltDash: [3, 2],
    yHintLo: 115,
    yHintHi: 35,
    fontSize: 10,
    fontColor: 'black',
    fontAlign: 'center',
    fontBaseline: 'middle'
  }
}

const styles = {
  relativePosition: 'position: relative;',
  fullWidth:
    'width: 100% !important; margin-left: 0 !important; margin-right: 0 !important;',
  absoluteTopLeft: 'position: absolute; top: 0; left: 0;'
}

// const Slicers = {
//   PCM: 'PCM',
//   PWM: 'PWM',
//   PPM: 'PPM',
//   MC: 'MC',
//   DM: 'DM',
//   NRZI: 'NRZI',
//   CMI: 'CMI',
//   PIWM: 'PIWM'
// }

const slicerOptions = [
  // { text: 'off', value: '' },
  { text: 'PCM', value: 'PCM' },
  { text: 'PWM', value: 'PWM' },
  { text: 'PPM', value: 'PPM' },
  { text: 'MC', value: 'MC' },
  { text: 'DM', value: 'DM' },
  { text: 'NRZI', value: 'NRZI' },
  { text: 'CMI', value: 'CMI' },
  { text: 'PIWM', value: 'PIWM' }
]

export { defaults, styles, slicerOptions }
