export function useNumbersOnly(evt: KeyboardEvent) {
  const char = evt.key;

  if (!/^\d$/.test(char) && char !== '.') {
    evt.preventDefault();
  }
}
