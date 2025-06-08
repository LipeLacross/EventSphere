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
  const { id } = event.context.params
  if (event.method === 'GET') {
    return events.find(e => e.id == id)
  }
  if (event.method === 'DELETE') {
    events = events.filter(e => e.id != id)
    return { ok: true }
  }
  if (event.method === 'PUT') {
    const body = await readBody(event)
    events = events.map(e => (e.id == id ? { ...e, ...body } : e))
    return events.find(e => e.id == id)
  }
})
