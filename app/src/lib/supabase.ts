import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Pulls a human-readable message out of a failed `functions.invoke()` call.
 * On a non-2xx response supabase-js returns a FunctionsHttpError whose body
 * (e.g. `{ error: "..." }`) is available via `error.context`.
 */
export async function extractErrorMessage(error: unknown): Promise<string> {
  const fallback = "Something went wrong. Please try again."
  if (!error) return fallback

  const context = (error as { context?: Response }).context
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json()
      if (body?.error) return body.error
      if (body?.message) return body.message
    } catch {
      // body wasn't JSON — fall through to the error message
    }
  }

  return error instanceof Error ? error.message : fallback
}
