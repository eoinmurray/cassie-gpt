import { logging } from "@/utils/logging"

export default async function makeCall(url: string, fixture?: any) {
  logging.log(`POSTING ${url}`, 1)
  const response = await fetch(url, {
    method: fixture ? 'POST' : 'GET',
    body: fixture || undefined, 
  })

  if (!response.ok) {
    logging.error(`Failed to POST ${url}: ${response.status} - ${response.statusText}`)
    return null
  }
  const json = await response.json()
  return json
}
