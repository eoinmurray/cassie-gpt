import child_process from 'child_process'
import { logging } from '@/utils/logging'

const checkForEvents = (data: any, events: string[]): String | null => {
  for (const event of events) {
    // eslint-disable-next-line no-control-regex
    const log = data.toString().toLowerCase().trim().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    // eslint-disable-next-line no-control-regex
    const cleanEvent = event.toLocaleLowerCase().trim().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    if (log.includes(cleanEvent)) {
      return event
    }
  }
  return null
}

export const startTestService = async ({
  command,
  filterOutEvents = [],
}: {
  command: string
  filterOutEvents?: string[],
}): Promise<child_process.ChildProcessWithoutNullStreams> => {
  const server = await child_process.spawn(command, { shell: true, env: process.env })
  server.on('error', (err) => {
    logging.error(`Server "${command}" error: ${err}`)
  })

  server.on('exit', (code, signal) => {
    logging.log(`Server "${command}" exited with code: ${code} and signal: ${signal}`)
  })

  const processStdoutData = async (data: any) => {
    if (!checkForEvents(data, filterOutEvents)) {
      process.stdout.write(data.toString())
    }
  }

  server.stdout.on('data', async (data) => await processStdoutData(data))
  server.stderr.on('data', async (data) => await processStdoutData(data))

  return server
}
