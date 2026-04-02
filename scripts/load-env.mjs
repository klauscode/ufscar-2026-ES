import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function parseEnvFile(contents) {
  const values = {}

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    values[key] = value
  }

  return values
}

for (const filename of ['.env.local', '.env']) {
  const envPath = path.join(projectRoot, filename)

  if (!fs.existsSync(envPath)) continue

  const values = parseEnvFile(fs.readFileSync(envPath, 'utf8'))

  for (const [key, value] of Object.entries(values)) {
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

export function getSupabaseScriptEnv() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase env vars. Set SUPABASE_SERVICE_ROLE_KEY and either SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.'
    )
  }

  return { supabaseUrl, serviceRoleKey }
}
