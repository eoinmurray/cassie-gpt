import { join } from "path"
import { writeFile } from "fs/promises"
import { logging } from "./logging"

export default async function proof(content: any, uniqueString: string = 'message-id') {
  const filename = uniqueString
    .slice(0, 6)
    // .replace(/[^a-z0-9]/gi, '_')
    .replace('<', '')
    .replace('>', '')
    + '.txt'

  const p = join(process.cwd(), 'src', 'tests', 'proofs', filename)
  await writeFile(p, content)
  logging.log({
    proofed: p
  })
}