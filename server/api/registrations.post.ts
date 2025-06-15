import { readBody, createError } from 'h3'

interface EmailData {
  to: string
  subject: string
  text: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validar se os dados necessários estão presentes
    if (!body.email || !body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email e nome são obrigatórios'
      })
    }

    // Enviar e-mail de confirmação
    const emailData: EmailData = {
      to: body.email,
      subject: 'Confirmação de Inscrição',
      text: `Olá ${body.name},\n\nSua inscrição foi confirmada com sucesso!\n\nObrigado por participar.\n\nEquipe EventSphere`
    }

    await $fetch('/api/mail', {
      method: 'POST',
      body: emailData
    })

    return {
      success: true,
      message: 'E-mail de confirmação enviado com sucesso'
    }
  } catch (err) {
    console.error('Erro ao enviar confirmação:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao enviar confirmação por e-mail'
    })
  }
})
