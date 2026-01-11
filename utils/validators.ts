// utils/validators.ts

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password minimal 6 karakter' }
  }
  return { valid: true }
}

export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = 'Email wajib diisi'
  } else if (!validateEmail(email)) {
    errors.email = 'Email tidak valid'
  }

  if (!password) {
    errors.password = 'Password wajib diisi'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
