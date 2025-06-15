import { serverSupabaseClient } from '#supabase/server'
import { getQuery } from 'h3'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const query = getQuery(event)

    let queryBuilder = client
      .from('events')
      .select('*')

    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category)
    }

    if (query.location) {
      queryBuilder = queryBuilder.ilike('location', `%${query.location}%`)
    }

    const { data, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao buscar eventos',
        data: error
      })
    }

    return data

  } catch (error) {
    console.error('Erro na API de eventos:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
