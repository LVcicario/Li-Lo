import DOMPurify from 'isomorphic-dompurify'

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove HTML tags and potentially dangerous content
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [] // No attributes allowed
  }).trim()
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }

  return sanitized
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export function validatePostalCode(postalCode: string, country: string): boolean {
  const postalRegexes: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
    FR: /^\d{5}$/,
    DE: /^\d{5}$/,
    IT: /^\d{5}$/,
    ES: /^\d{5}$/,
    JP: /^\d{3}-\d{4}$/,
    AU: /^\d{4}$/
  }

  const regex = postalRegexes[country]
  return regex ? regex.test(postalCode) : true // Allow if no regex defined
}

export function sanitizeAndValidateFormData(data: any) {
  const sanitized = sanitizeObject(data)
  const errors: string[] = []

  // Validate required fields
  if (!sanitized.firstName || sanitized.firstName.length < 1) {
    errors.push('First name is required')
  }

  if (!sanitized.lastName || sanitized.lastName.length < 1) {
    errors.push('Last name is required')
  }

  if (!sanitized.email || !validateEmail(sanitized.email)) {
    errors.push('Valid email address is required')
  }

  if (!sanitized.phone || !validatePhone(sanitized.phone)) {
    errors.push('Valid phone number is required')
  }

  if (!sanitized.address || sanitized.address.length < 5) {
    errors.push('Valid street address is required')
  }

  if (!sanitized.city || sanitized.city.length < 1) {
    errors.push('City is required')
  }

  if (!sanitized.postalCode || !validatePostalCode(sanitized.postalCode, sanitized.country)) {
    errors.push('Valid postal code is required')
  }

  if (!sanitized.country || sanitized.country.length !== 2) {
    errors.push('Valid country is required')
  }

  return {
    sanitizedData: sanitized,
    errors,
    isValid: errors.length === 0
  }
}