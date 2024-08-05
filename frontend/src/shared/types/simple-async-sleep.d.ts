// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

declare module 'simple-async-sleep' {
  /**
   * Sleeps for the given number of milliseconds.
   * @param ms - The number of milliseconds to sleep.
   * @returns A Promise that resolves after the specified time.
   */
  function sleep(ms: number): Promise<void>

  export default sleep
}
