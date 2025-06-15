import { serverSupabaseClient } from '#supabase/server'
import { getQuery, readBody, createError } from 'h3'
import type { Database } from '~/database.types'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const method = getMethod(event)

  try {
    if (method === 'GET') {
      const query = getQuery(event)
      let queryBuilder = client.from('events').select('*')

      // Aplicar filtros se fornecidos
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

    if (method === 'POST') {
      const body = await readBody<EventInsert>(event)

      // Validações obrigatórias
      if (!body.title || !body.date || !body.location) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Título, data e localização são obrigatórios'
        })
      }

      // Validar formato da data
      if (isNaN(Date.parse(body.date))) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Formato de data inválido'
        })
      }

      const { data, error } = await client
        .from('events')
        .insert({
          title: body.title.trim(),
          date: body.date,
          location: body.location.trim(),
          description: body.description?.trim() || '',
          category: body.category || '',
          image_url: body.image_url || ''
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar evento:', error)
        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao criar evento: ${error.message}`
        })
      }

      return data
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Método não permitido'
    })

  } catch (err: any) {
    console.error('Erro na API de eventos:', err)

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
