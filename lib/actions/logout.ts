'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function logoutAction() {
  const cookieStore = cookies()
  
  // Clear NextAuth cookies
  cookieStore.delete('next-auth.session-token')
  cookieStore.delete('next-auth.csrf-token')
  cookieStore.delete('__Secure-next-auth.session-token') // for HTTPS
  
  redirect('/login')
}