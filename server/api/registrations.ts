let registrations = []

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return registrations
  }
  if (event.method === 'POST') {
    const body = await readBody(event)
    const newReg = { id: registrations.length + 1, ...body }
    registrations.push(newReg)
    // Aqui pode disparar e-mail
    return newReg
  }
})
