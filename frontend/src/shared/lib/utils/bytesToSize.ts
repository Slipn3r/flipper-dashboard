export const bytesToSize = (bytes: number | undefined) => {
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (!bytes || bytes === 0) return 'n/a'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}
