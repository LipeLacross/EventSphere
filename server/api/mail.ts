import nodemailer from 'nodemailer'
import { readBody, createError } from 'h3'

interface MailRequest {
  to: string
  subject: string
  text: string
  html?: string
}

export default defineEventHandler(async (event) => {
  try {
    const { to, subject, text, html } = await readBody<MailRequest>(event)

    // Validar dados obrigatórios
    if (!to || !subject || !text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destinatário, assunto e texto são obrigatórios'
      })
    }

    // Configurar transportador SMTP - CORREÇÃO: createTransport em vez de createTransporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Verificar conexão SMTP
    await transporter.verify()

    // Enviar e-mail
    const mailOptions = {
      from: `"EventSphere" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`
    }

    const info = await transporter.sendMail(mailOptions)

    // Fechar conexão
    transporter.close()

    return {
      success: true,
      messageId: info.messageId,
      message: 'E-mail enviado com sucesso'
    }
  } catch (err: any) {
    console.error('Erro ao enviar e-mail:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao enviar e-mail: ${err.message || 'Erro desconhecido'}`
    })
  }
})
