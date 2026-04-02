function fail(message: string): never {
  throw new Error(message)
}

export function requireObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('Invalid request payload.')
  }

  return value as Record<string, unknown>
}

export function requireString(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) {
    fail(`Field "${field}" is required.`)
  }

  return value.trim()
}

export function optionalString(value: unknown) {
  if (value == null || value === '') {
    return null
  }

  if (typeof value !== 'string') {
    fail('Invalid optional text field.')
  }

  return value.trim()
}

export function requireBoolean(value: unknown, field: string) {
  if (typeof value !== 'boolean') {
    fail(`Field "${field}" must be true or false.`)
  }

  return value
}

export function requireUuid(value: unknown, field: string) {
  const text = requireString(value, field)

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      text
    )
  ) {
    fail(`Field "${field}" must be a valid id.`)
  }

  return text
}

export function requireDayOfWeek(value: unknown) {
  if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 6) {
    fail('Field "day_of_week" must be between 0 and 6.')
  }

  return Number(value)
}

export function requireTime(value: unknown, field: string) {
  const text = requireString(value, field)

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(text)) {
    fail(`Field "${field}" must use HH:MM format.`)
  }

  return text.slice(0, 5)
}

export function requireDateOnly(value: unknown, field: string) {
  const text = requireString(value, field)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    fail(`Field "${field}" must use YYYY-MM-DD format.`)
  }

  return text
}

export function requireDateTime(value: unknown, field: string) {
  const text = requireString(value, field)
  const date = new Date(text)

  if (Number.isNaN(date.getTime())) {
    fail(`Field "${field}" must be a valid date/time.`)
  }

  return date.toISOString()
}
