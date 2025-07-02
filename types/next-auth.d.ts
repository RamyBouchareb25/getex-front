import * as next_auth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
    accessToken?: string
  }

  interface User {
    role: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken?: string
  }
}
