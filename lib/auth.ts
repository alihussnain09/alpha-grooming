// Admin authentication utilities
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function getAdminToken(): string {
  return "admin-token-" + Date.now()
}

export function isAdminAuthenticated(token: string | null): boolean {
  return token?.startsWith("admin-token-") ?? false
}
