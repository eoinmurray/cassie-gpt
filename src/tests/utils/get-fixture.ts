import { readFile } from "node:fs/promises"
import { join } from "node:path";


export default async function getFixture({ fixtureName }: {fixtureName?: string }): Promise<any> {
  if (!fixtureName) {
    fixtureName = process.env.NEXT_PUBLIC_DOMAIN?.includes("testbot") ? 
    `test-${process.env.FIXTURE}-testbot.txt` : 
    `test-${process.env.FIXTURE}.txt`
  }
  
  return readFile(join('src', 'tests', 'fixtures', fixtureName));
}