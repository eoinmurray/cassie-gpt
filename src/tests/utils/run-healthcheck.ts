export default async function runHealthcheck() {
  const healthcheckUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/api/healthcheck`
  const healthcheck = await fetch(healthcheckUrl)
  if (healthcheck.status !== 200) {
    return null
  } else {
    const healthcheckJson = await healthcheck.json()
    return healthcheckJson.data
  }
}