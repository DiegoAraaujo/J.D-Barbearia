import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import {
  formatDatePtBr,
  isValidBrazilianPhone,
  validateSchedule,
  whatsappNumber,
} from "@/utils/appointment"

type AppointmentPayload = {
  name?: unknown
  phone?: unknown
  service?: unknown
  date?: unknown
  time?: unknown
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  )

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AppointmentPayload
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const service = typeof body.service === "string" ? body.service.trim() : ""
    const date = typeof body.date === "string" ? body.date.trim() : ""
    const time = typeof body.time === "string" ? body.time.trim() : ""

    if (!name || !phone || !service || !date || !time) {
      return NextResponse.json(
        { error: "Preencha nome, WhatsApp, serviço, data e horário.", code: "invalid_fields" },
        { status: 400 },
      )
    }

    if (!isValidBrazilianPhone(phone)) {
      return NextResponse.json(
        { error: "Informe um WhatsApp válido com DDD.", code: "invalid_phone" },
        { status: 400 },
      )
    }

    const scheduleStatus = validateSchedule(date, time)
    if (scheduleStatus !== "valid") {
      const message = scheduleStatus === "past"
        ? "Escolha uma data e um horário futuros."
        : "Esse horário não está disponível para agendamento online."
      return NextResponse.json({ error: message, code: scheduleStatus }, { status: 400 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT ?? 465)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.MAIL_FROM
    const to = process.env.MAIL_TO

    if (!host || !user || !pass || !from || !to || Number.isNaN(port)) {
      console.error("Configuração SMTP incompleta.")
      return NextResponse.json(
        { error: "O envio de e-mail ainda não foi configurado." },
        { status: 500 },
      )
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    })

    const safeName = escapeHtml(name)
    const safePhone = escapeHtml(phone)
    const safeService = escapeHtml(service)
    const safeTime = escapeHtml(time)
    const displayDate = formatDatePtBr(date)
    const customerWhatsappUrl = `https://wa.me/${whatsappNumber(phone)}`

    await transporter.sendMail({
      from,
      to,
      subject: `Novo pedido de agendamento — ${name}`,
      text: `Novo pedido de agendamento\n\nNome: ${name}\nWhatsApp: ${phone}\nServiço: ${service}\nData: ${displayDate}\nHorário: ${time}\n\nAtenção: este horário ainda não foi confirmado.`,
      html: `
        <!doctype html>
        <html lang="pt-BR">
        <head>
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light only">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>
            :root { color-scheme: light only; supported-color-schemes: light only; }
            .force-white, .force-white * { color:#ffffff !important; -webkit-text-fill-color:#ffffff !important; }
            [data-ogsc] .force-white, [data-ogsb] .force-white { color:#ffffff !important; -webkit-text-fill-color:#ffffff !important; }
          </style>
        </head>
        <body style="margin:0;padding:0">
        <div style="margin:0;padding:32px 16px;font-family:Arial,sans-serif">
          <div style="max-width:620px;margin:auto;overflow:hidden;border:1px solid rgba(201,162,75,.25);border-radius:12px;background:#17140f">
            <div class="force-white" bgcolor="#6f1d2a" style="padding:28px 24px;border-bottom:1px solid #332d25;background-color:#6f1d2a;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important">
              <div style="font-size:12px;letter-spacing:3px;color:#e8c878">J.D BARBEARIA</div>
              <h1 class="force-white" style="margin:10px 0 0;font-size:26px;line-height:1.2;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important"><font color="#ffffff">Novo pedido de agendamento</font></h1>
              <p class="force-white" style="margin:10px 0 0;font-size:15px;line-height:1.5;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important"><font color="#ffffff">Confira os dados escolhidos pelo cliente.</font></p>
            </div>
            <div style="padding:28px 32px">
              <div style="margin-bottom:22px;padding:14px 16px;border-left:3px solid #c9a24b;background:rgba(201,162,75,.08);color:#e8c878;font-size:14px">
                Este pedido ainda não está confirmado. Retorne ao cliente pelo WhatsApp para confirmar o horário.
              </div>
              <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px">
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);color:#8a8175">Cliente</td><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);text-align:right;color:#ede6d8;font-weight:bold">${safeName}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);color:#8a8175">WhatsApp</td><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);text-align:right;color:#ede6d8">${safePhone}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);color:#8a8175">Serviço</td><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);text-align:right;color:#ede6d8">${safeService}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);color:#8a8175">Data</td><td style="padding:12px 0;border-bottom:1px solid rgba(237,230,216,.1);text-align:right;color:#ede6d8">${escapeHtml(displayDate)}</td></tr>
                <tr><td style="padding:12px 0;color:#8a8175">Horário</td><td style="padding:12px 0;text-align:right;color:#ede6d8">${safeTime}</td></tr>
              </table>
              <div style="margin-top:28px;text-align:center">
                <a class="force-white" href="${customerWhatsappUrl}" bgcolor="#25D366" style="display:inline-block;padding:14px 22px;border-radius:6px;background-color:#25D366;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important;text-decoration:none;font-weight:bold"><font color="#ffffff">Conversar no WhatsApp</font></a>
              </div>
            </div>
            <div style="padding:18px 32px;background:#0b0a09;color:#8a8175;font-size:12px;text-align:center">Solicitação enviada pelo site da J.D Barbearia</div>
          </div>
        </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to send appointment:", error)
    return NextResponse.json(
      { error: "Não foi possível enviar o agendamento. Tente novamente." },
      { status: 500 },
    )
  }
}
