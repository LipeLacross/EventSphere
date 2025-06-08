import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const { to, subject, text } = await readBody(event)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  })
  return { ok: true }
})
