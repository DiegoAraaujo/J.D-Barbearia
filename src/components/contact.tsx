"use client"

import { useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, LoaderCircle, MessageCircle, X } from "lucide-react"
import { FaInstagram } from "react-icons/fa"
import Reveal from "@/components/reveal"
import { formatDatePtBr, getBrazilToday, isValidBrazilianPhone, validateSchedule } from "@/utils/appointment"

const schedules = [
  ["Segunda a quarta", "18:00 às 20:30"],
  ["Quinta-feira", "06:00 às 08:30 · 16:00 às 17:00"],
  ["Sexta-feira", "06:00 às 08:30 · 16:00 às 18:00"],
  ["Sábado", "06:00 às 20:00"],
  ["Domingo", "06:00 às 13:00"],
]

const businessWhatsappUrl = "https://wa.me/5588996553613"

const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const Contact = () => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [scheduleError, setScheduleError] = useState("")

  const continueForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValidBrazilianPhone(phone)) {
      setPhoneError("Informe o WhatsApp com DDD: 10 ou 11 dígitos.")
      return
    }
    setPhoneError("")
    if (name.trim()) setStep(2)
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const scheduleStatus = validateSchedule(date, time)
    if (scheduleStatus !== "valid") {
      setScheduleError(
        scheduleStatus === "past"
          ? "Não é possível escolher uma data ou um horário que já passou."
          : "Esse horário não está disponível para agendamento online.",
      )
      return
    }
    setScheduleError("")
    setStep(3)
    setStatus("sending")
    setErrorMessage("")

    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, service, date, time }),
      })
      const result = (await response.json()) as { error?: string; code?: string }
      if (!response.ok && (result.code === "past" || result.code === "unavailable")) {
        setStatus("idle")
        setStep(2)
        setScheduleError(result.error ?? "Esse horário não está disponível.")
        return
      }
      if (!response.ok) throw new Error(result.error ?? "Não foi possível enviar o pedido.")
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível enviar o pedido.")
    }
  }

  const resetForm = () => {
    setName("")
    setPhone("")
    setService("")
    setDate("")
    setTime("")
    setStatus("idle")
    setPhoneError("")
    setScheduleError("")
    setStep(1)
  }

  return (
    <section id="contact" className="scroll-mt-20 bg-surface bg-[radial-gradient(circle_at_12%_78%,rgba(104,21,42,0.16),transparent_32%)] px-6 py-16 md:scroll-mt-24 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex items-end gap-4 md:mb-12">
            <span className="h-12 w-px bg-gold" />
            <div>
              <h2 className="font-display text-4xl leading-tight text-white md:text-5xl">Vamos agendar?</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-bone/60 md:text-base">
                Escolha o melhor dia ou fale comigo diretamente pelo WhatsApp ou Instagram.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-[1.2fr_0.8fr]">
          <Reveal className="h-full lg:row-span-2">
            <div className="h-full min-h-[460px] rounded-2xl border border-bone/10 bg-ink p-6 shadow-[0_20px_60px_rgba(104,21,42,0.1)] md:p-8">
              <div className="mb-7 flex items-center gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex flex-1 items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step >= item ? "bg-gold text-ink" : "border border-bone/20 text-bone/40"}`}>
                      {step > item || (item === 3 && status === "success") ? <Check className="h-4 w-4" /> : item}
                    </span>
                    <span className={`hidden text-xs uppercase tracking-[0.14em] sm:block ${step >= item ? "text-bone" : "text-bone/35"}`}>
                      {item === 1 ? "Seu nome" : item === 2 ? "Agendamento" : "Confirmação"}
                    </span>
                    {item < 3 ? <span className="h-px flex-1 bg-bone/10" /> : null}
                  </div>
                ))}
              </div>

              {step === 3 ? (
                <div className="flex min-h-[290px] flex-col items-center justify-center text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${status === "error" ? "bg-wine-bright text-bone" : "bg-gold text-ink"}`}>
                    {status === "sending" ? <LoaderCircle className="h-7 w-7 animate-spin" /> : status === "error" ? <X className="h-7 w-7" /> : <Check className="h-7 w-7" />}
                  </div>
                  <span className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    {status === "sending" ? "Enviando solicitação" : status === "error" ? "Falha no envio" : "Enviado com sucesso"}
                  </span>
                  <h3 className="mt-2 font-display text-3xl text-bone">
                    {status === "sending" ? "Só um instante..." : status === "error" ? "Não conseguimos enviar." : `Solicitação concluída, ${name}.`}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/60">
                    {status === "sending"
                      ? "Estamos enviando os dados do seu agendamento."
                      : status === "error"
                        ? errorMessage
                        : `Você escolheu ${service} para ${formatDatePtBr(date)}, às ${time}. O horário ainda não está confirmado. Retornarei pelo WhatsApp o mais rápido possível para confirmar.`}
                  </p>
                  {status === "error" ? (
                    <button type="button" onClick={() => { setStatus("idle"); setStep(2) }} className="mt-7 text-sm font-medium text-gold hover:text-gold-bright">
                      Voltar e tentar novamente
                    </button>
                  ) : status === "success" ? (
                    <button type="button" onClick={resetForm} className="mt-7 text-sm font-medium text-gold hover:text-gold-bright">
                      Fazer outro agendamento
                    </button>
                  ) : null}
                </div>
              ) : step === 1 ? (
                <form onSubmit={continueForm} className="flex min-h-[290px] flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Primeiro passo</span>
                  <h3 className="mt-3 font-display text-3xl text-bone md:text-4xl">Como posso chamar você?</h3>
                  <p className="mt-3 text-sm text-bone/55">Informe seu nome e WhatsApp para começar o agendamento.</p>
                  <label htmlFor="contact-name" className="mt-8 text-sm font-medium text-bone">Seu nome</label>
                  <input
                    id="contact-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Digite seu nome"
                    className="mt-2 h-12 rounded-sm border border-bone/15 bg-surface px-4 text-sm text-bone outline-none transition-colors placeholder:text-bone/25 focus:border-gold/70"
                  />
                  <label htmlFor="contact-phone" className="mt-5 text-sm font-medium text-bone">WhatsApp com DDD</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => { setPhone(formatPhone(event.target.value)); setPhoneError("") }}
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(88) 99999-9999"
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? "phone-error" : undefined}
                    className="mt-2 h-12 rounded-sm border border-bone/15 bg-surface px-4 text-sm text-bone outline-none transition-colors placeholder:text-bone/25 focus:border-gold/70"
                  />
                  {phoneError ? <p id="phone-error" className="mt-2 text-xs text-wine-bright">{phoneError}</p> : null}
                  <button type="submit" className="group mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-ink shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bone hover:shadow-xl active:translate-y-0 sm:self-start">
                    Continuar <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={submitForm} className="flex flex-col">
                  <button type="button" onClick={() => setStep(1)} className="group mb-5 inline-flex w-fit items-center gap-2 text-xs text-bone/50 transition-colors hover:text-gold">
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Voltar
                  </button>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Olá, {name}</span>
                  <h3 className="mt-2 font-display text-3xl text-bone">Escolha seu atendimento</h3>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-medium text-bone sm:col-span-2">
                      Serviço
                      <select required value={service} onChange={(event) => setService(event.target.value)} className="h-12 rounded-sm border border-bone/15 bg-surface px-4 text-sm text-bone outline-none focus:border-gold/70">
                        <option value="" disabled>Selecione um serviço</option>
                        <option>Barba</option>
                        <option>Cabelo</option>
                        <option>Corte + barba</option>
                        <option>Sobrancelha</option>
                        <option>Combão do mês</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium text-bone">
                      Data
                      <input type="date" required min={getBrazilToday()} value={date} onChange={(event) => { setDate(event.target.value); setScheduleError("") }} className="h-12 rounded-sm border border-bone/15 bg-surface px-4 text-sm text-bone scheme-dark outline-none focus:border-gold/70" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium text-bone">
                      Horário
                      <input type="time" required value={time} onChange={(event) => { setTime(event.target.value); setScheduleError("") }} className="h-12 rounded-sm border border-bone/15 bg-surface px-4 text-sm text-bone scheme-dark outline-none focus:border-gold/70" />
                    </label>
                  </div>

                  {scheduleError ? (
                    <p className="mt-4 rounded-sm border border-bone/10 bg-wine/20 p-3 text-sm leading-relaxed text-bone/75">
                      {scheduleError}{" "}
                      <a href={businessWhatsappUrl} target="_blank" rel="noreferrer" className="font-medium text-gold underline underline-offset-2">
                        Clique aqui e fale comigo no WhatsApp para resolvermos da melhor forma.
                      </a>
                    </p>
                  ) : null}

                  <button type="submit" className="group mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-ink shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bone hover:shadow-xl active:translate-y-0 sm:self-start">
                    Solicitar agendamento <CalendarDays className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

            <Reveal delay={0.1} className="h-full">
              <div className="h-full rounded-2xl border border-bone/10 bg-ink p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-gold" strokeWidth={1.5} />
                  <h3 className="font-display text-2xl text-bone">Horários</h3>
                </div>
                <div className="mt-4 divide-y divide-bone/10">
                  {schedules.map(([day, hours]) => (
                    <div key={day} className="flex flex-col gap-1 py-2.5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-bone/65">{day}</span>
                      <span className="text-sm font-medium text-bone">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18} className="h-full">
              <div className="flex h-full flex-col justify-center rounded-2xl border border-bone/10 bg-ink p-6 md:p-7">
                <h3 className="font-display text-2xl text-bone">Prefere falar diretamente?</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/55">Entre em contato pelo canal que for mais confortável para você.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <a href={businessWhatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-medium text-white transition-transform hover:scale-[1.02]">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-bone/15 bg-wine/25 px-3 py-2.5 text-xs font-medium text-bone/75 transition-colors hover:border-gold/50 hover:bg-bone/5 hover:text-gold">
                    <FaInstagram className="h-4 w-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
