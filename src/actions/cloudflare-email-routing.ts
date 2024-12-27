
const worker = {
  async fetch() {
    return new Response("Hello from worker.");
  },
  
  async email(message: { [x: string]: any; raw: BodyInit | null | undefined; headers: any; to: string | any[]; cc: any; bcc: any; from: any; subject: any; date: any; timestamp: any; text: any; html: any; inlines: any; attachments: any; }, env: { DEVELOPMENT_DOMAIN: any; PRODUCTION_DOMAIN: any; }) { 
    const DEVELOPMENT_DOMAIN = env.DEVELOPMENT_DOMAIN
    const PRODUCTION_DOMAIN = env.PRODUCTION_DOMAIN

    let url = `https://${PRODUCTION_DOMAIN}/api/create-message`
    if (message.to.includes(DEVELOPMENT_DOMAIN)) {
      url = `https://${DEVELOPMENT_DOMAIN}/api/create-message`
    }

    const response = await fetch(url, { method: 'POST', body: message.raw })
    console.log({ url, statusCode: response.status, statusText: response.statusText, })
  }
}

export default worker
