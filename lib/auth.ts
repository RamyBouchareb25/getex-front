import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  // Interface for JWT token payload
  export interface JWTTokenPayload {
    sub: string;
    email: string;
    role: string;
    raisonSocial: string;
    rc: string;
    phone: number;
    commune: string;
    wilaya: string;
    nif: string;
    nis: string;
    name: string;
    iat: number;
    exp: number;
  }
// Registration function
export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) {
  try {
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return {
      success: true,
      user: data.user,
      access_token: data.access_token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          const { access_token: token } = data;
          if (token) {
            const decodedToken = jwtDecode(token) as JWTTokenPayload;
            return {
              id: decodedToken.sub,
              email: decodedToken.email,
              role: decodedToken.role,
              name: decodedToken.name,
              accessToken: token,
              raisonSocial: decodedToken.raisonSocial,
              rc: decodedToken.rc,
              phone: decodedToken.phone,
              commune: decodedToken.commune,
              wilaya: decodedToken.wilaya,
              nif: decodedToken.nif,
              nis: decodedToken.nis,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
