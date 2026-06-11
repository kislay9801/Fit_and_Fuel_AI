/**
 * Admin access control.
 *
 * Note: this is UI-level gating only. The Firestore security rules are what
 * actually protect the data. For a production-grade admin role you'd set a
 * custom claim on the auth token and enforce it in the rules; here we simply
 * hide the admin UI for everyone except the owner's account.
 */

export const ADMIN_EMAILS = [
  'kaustubh.kislay@athenaeducation.co.in',
]

export function isAdmin(user) {
  if (!user?.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}
