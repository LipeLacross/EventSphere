// server/api/events/[id].ts
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/database.types'

export default defineEventHandler(async (event) => {
  try {
    // CORREÇÃO: Aguardar o cliente Supabase
    const client = await serverSupabaseClient<Database>(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do evento não fornecido'
      })
    }

    // Validar se o ID é um número
    const eventId = parseInt(id, 10)
    if (isNaN(eventId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do evento inválido'
      })
    }

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

  } catch (err: any) {
    // Se já é um erro HTTP, repassar
    if (err.statusCode) {
      throw err
    }

    // Caso contrário, criar erro genérico
    console.error('Erro na API events/[id]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
      data: { message: err.message }
    })
  }
})
