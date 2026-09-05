import "server-only"

import { createClient } from "@supabase/supabase-js"

const getEnvironment = () => {
  const url = process.env.SUPABASE_URL
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
  const secretKey = process.env.SUPABASE_SECRET_KEY

  if (!url || !publishableKey || !secretKey) {
    throw new Error("Variáveis de ambiente do Supabase não configuradas.")
  }

  return { url, publishableKey, secretKey }
}

export const createPublicSupabaseClient = () => {
  const { url, publishableKey } = getEnvironment()
  return createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const createAdminSupabaseClient = () => {
  const { url, secretKey } = getEnvironment()
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
