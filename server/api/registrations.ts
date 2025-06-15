import { serverSupabaseClient } from '#supabase/server'
import { readBody, createError } from 'h3'
import type { Database } from '~/database.types'

type Registration = Database['public']['Tables']['registrations']['Row']
type RegistrationInsert = Database['public']['Tables']['registrations']['Insert']

interface RegistrationWithEvent extends Registration {
  eventTitle?: string
  events?: {
    title: string
    date: string
    location: string
  }
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)

  if (event.method === 'GET') {
    try {
      const { data, error } = await client
        .from('registrations')
        .select(`
          *,
          events:event_id (
            title,
            date,
            location
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao buscar inscrições: ${error.message}`
        })
      }

      const registrationsWithEventTitle: RegistrationWithEvent[] = data?.map((reg: any) => ({
        ...reg,
        eventTitle: reg.events?.title || 'Evento não encontrado'
      })) || []

      return registrationsWithEventTitle
    } catch (err: any) {
      console.error('Erro na API de inscrições:', err)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor'
      })
    }
  }

  if (event.method === 'POST') {
    try {
      const body = await readBody<RegistrationInsert>(event)

      if (!body.name || !body.email || !body.event_id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nome, email e ID do evento são obrigatórios'
        })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Formato de email inválido'
        })
      }

      const { data: eventExists, error: eventError } = await client
        .from('events')
        .select('id, title')
        .eq('id', body.event_id)
        .single()

      if (eventError || !eventExists) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Evento não encontrado'
        })
      }

      const { data: existingRegistration } = await client
        .from('registrations')
        .select('id')
        .eq('email', body.email)
        .eq('event_id', body.event_id)
        .maybeSingle()

      if (existingRegistration) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Usuário já inscrito neste evento'
        })
      }

      const { data, error } = await client
        .from('registrations')
        .insert(body)
        .select()
        .single()

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao criar inscrição: ${error.message}`
        })
      }

      try {
        await $fetch('/api/mail', {
          method: 'POST',
          body: {
            to: body.email,
            subject: `Confirmação de Inscrição - ${eventExists.title}`,
            text: `Olá ${body.name},\n\nSua inscrição no evento "${eventExists.title}" foi confirmada com sucesso!\n\nObrigado por participar.\n\nEquipe EventSphere`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Confirmação de Inscrição</h2>
                <p>Olá <strong>${body.name}</strong>,</p>
                <p>Sua inscrição no evento "<strong>${eventExists.title}</strong>" foi confirmada com sucesso!</p>
                <p>Obrigado por participar.</p>
                <p><em>Equipe EventSphere</em></p>
              </div>
            `
          }
        })
      } catch (mailError) {
        console.error('Erro ao enviar e-mail:', mailError)
      }

      return data
    } catch (err: any) {
      console.error('Erro ao processar inscrição:', err)
      if (err.statusCode) {
        throw err
      }
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Método não permitido'
  })
})
