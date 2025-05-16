import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/app/lib/mongodb";
import { compare } from "bcrypt";
import { getServerSession } from "next-auth/next";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {


                    return null;
                }

                const { db } = await connectToDatabase();
                const user = await db.collection("users").findOne({ email: credentials.email });
                console.log('🚀 ~ route.ts ~ authorize ~ user:', user);

                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image || null,
                    address: user.address,
                    phone: user.phone,
                    role: user.role || "user",
                };
            }
        }),
        // يمكنك إضافة مزودي مصادقة آخرين هنا مثل Google أو GitHub
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 يوم
    },
    callbacks: {
        async jwt({ token, user, trigger,session }) {

            // console.log('🚀 ~ route.ts ~ jwt ~ session:', session);

            if(trigger === 'update' && session){
                token.name = session.user.name;
                token.picture = session.user.image;
                token.address = session.user.address;
                token.phone = session.user.phone;
            }



            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.phone = token.phone;
                session.user.image = token.picture;
                session.user.address = token.address;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export const getAuthSession = () => getServerSession(authOptions);