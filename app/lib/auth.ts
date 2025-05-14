import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongodb";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        const { db } = await connectToDatabase();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          throw new Error("البريد الإلكتروني غير مسجل");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          address: user.address,
          role: user.role || "user"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // إضافة role إلى الـ token عند تسجيل الدخول
      if (user) {
        token.role = user.role;
        token.image = user.image;
        token.phone = user.phone;
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }) {
      // إضافة role إلى الـ session
      if (session.user) {
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.phone = token.phone;
        session.user.address = token.address;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// إضافة نوع للمستخدم لتضمين الـ role
declare module "next-auth" {
  interface User {
    role?: string;
    image?: string;
    phone?: string;
    address?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      image?: string;
      phone?: string;
      address?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    image?: string;
    phone?: string;
    address?: string;
  }
}