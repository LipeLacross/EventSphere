let events = [
  {
    id: 1,
    title: "Conferência de Tecnologia",
    date: "2025-06-15",
    location: "São Paulo, SP",
    description: "Evento anual de inovações tech"
  }
]

export default defineEventHandler(async (event) => {
  // GET All
  if (event.method === 'GET') {
    return events
  }

  // POST
  if (event.method === 'POST') {
    const body = await readBody(event)
    const newEvent = {
      id: events.length + 1,
      ...body
    }
    events.push(newEvent)
    return newEvent
  }
})
