import { resolve } from 'path'
import { fileURLToPath } from 'url'

// call as isCLI(import.meta.url)
export default function isCLI (url: any) {
  try {
    return resolve(fileURLToPath(url)).includes(resolve(process.argv[1]!))
  } catch (e) {
    return false
  }
} 

