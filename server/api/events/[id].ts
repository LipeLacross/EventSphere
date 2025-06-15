import { serverSupabaseClient } from '#supabase/server'
import { readBody, createError } from 'h3'
import type { Database } from '~/database.types'

type Event = Database['public']['Tables']['events']['Row']
type EventUpdate = Database['public']['Tables']['events']['Update']

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  // Validar ID
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do evento não fornecido'
    })
  }

  const eventId = parseInt(id, 10)
  if (isNaN(eventId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do evento inválido'
    })
  }

  try {
    if (method === 'GET') {
      const { data, error } = await client
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw createError({
            statusCode: 404,
            statusMessage: 'Evento não encontrado'
          })
        }
        throw createError({
          statusCode: 500,
          statusMessage: `Erro do banco: ${error.message}`
        })
      }

      return data
    }

    if (method === 'PUT') {
      const body = await readBody<EventUpdate>(event)

      // Validações para atualização
      if (body.title && body.title.trim().length < 3) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Título deve ter pelo menos 3 caracteres'
        })
      }

      if (body.date && isNaN(Date.parse(body.date))) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Formato de data inválido'
        })
      }

      const updateData: Partial<Event> = {}
      if (body.title) updateData.title = body.title.trim()
      if (body.date) updateData.date = body.date
      if (body.location) updateData.location = body.location.trim()
      if (body.description !== undefined) updateData.description = body.description?.trim() || ''
      if (body.category !== undefined) updateData.category = body.category || ''
      if (body.image_url !== undefined) updateData.image_url = body.image_url || ''

      const { data, error } = await client
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .select()
        .single()

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao atualizar evento: ${error.message}`
        })
      }

      return data
    }

    if (method === 'DELETE') {
      // Verificar se o evento existe antes de deletar
      const { data: existingEvent, error: checkError } = await client
        .from('events')
        .select('id')
        .eq('id', eventId)
        .single()

      if (checkError || !existingEvent) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Evento não encontrado'
        })
      }

      const { error } = await client
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao deletar evento: ${error.message}`
        })
      }

      return { success: true, message: 'Evento deletado com sucesso' }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Método não permitido'
    })

  } catch (err: any) {
    console.error(`Erro na API events/[id] - ${method}:`, err)

    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
      data: { message: err.message || 'Erro desconhecido' }
    })
  }
})
