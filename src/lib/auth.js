import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import clientPromise from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "./mongodb";

// Variable global para comprobar si la autenticación está habilitada
export const isAuthEnabled = process.env.AUTH_ENABLED === "true";

export const authOptions = {
  providers: isAuthEnabled ? [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectMongoDB();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          return null;
        }
        
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!passwordMatch) {
          return null;
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ] : [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Añade datos del usuario al token JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      
      // Actualiza el token si hay cambios en la sesión
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Añade datos del token a la sesión
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = async () => {
  // Si la autenticación está deshabilitada, devuelve una sesión simulada
  if (!isAuthEnabled) {
    return {
      user: {
        id: "guest-id",
        name: "Guest User",
        email: "guest@example.com",
        role: "user",
        image: null,
      }
    };
  }
  
  // Si la autenticación está habilitada, comportamiento normal
  return getServerSession(authOptions);
};
