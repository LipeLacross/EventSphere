import { serverSupabaseClient } from '#supabase/server'
import { getQuery, readBody, createError } from 'h3'
import type { Database } from '~/database.types'

// Tipos baseados no schema do banco
type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const { id } = event.context.params || {}

  if (event.method === 'GET') {
    if (id) {
      const { data, error } = await client
        .from('events')
        .select('*')
        .eq('id', parseInt(id as string))
        .single()

      if (error) {
        throw createError({
          statusCode: 404,
          statusMessage: `Evento não encontrado: ${error.message}`
        })
      }
      return data
    } else {
      const query = getQuery(event)
      let queryBuilder = client.from('events').select('*')

      if (query.category) {
        queryBuilder = queryBuilder.eq('category', query.category as string)
      }
      if (query.location) {
        queryBuilder = queryBuilder.ilike('location', `%${query.location}%`)
      }
      if (query.date) {
        queryBuilder = queryBuilder.eq('date', query.date as string)
      }

      const { data, error } = await queryBuilder.order('date', { ascending: true })

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao buscar eventos: ${error.message}`
        })
      }
      return data || []
    }
  }

  if (event.method === 'POST') {
    const body = await readBody<EventInsert>(event)

    if (!body.title || !body.date || !body.location) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Título, data e localização são obrigatórios'
      })
    }

    const { data, error } = await client
      .from('events')
      .insert(body)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao criar evento: ${error.message}`
      })
    }
    return data
  }

  if (event.method === 'PUT') {
    const body = await readBody<EventUpdate>(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do evento é obrigatório para atualização'
      })
    }

    const { data, error } = await client
      .from('events')
      .update(body)
      .eq('id', parseInt(id as string))
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

  if (event.method === 'DELETE') {
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do evento é obrigatório para exclusão'
      })
    }

    const { error } = await client
      .from('events')
      .delete()
      .eq('id', parseInt(id as string))

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
})
