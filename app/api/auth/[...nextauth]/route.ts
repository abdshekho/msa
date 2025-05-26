import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/app/lib/mongodb";
import { compare } from "bcrypt";
import { getServerSession } from "next-auth/next";


export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
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
    ],
    callbacks: {
        async signIn({ user, account }) {


            // Handle Google sign in
            if (account?.provider === "google") {
                const { db } = await connectToDatabase();

                // Check if user exists
                const existingUser = await db.collection("users").findOne({ email: user.email });


                if (!existingUser) {
                    // Create new user if they don't exist
                    await db.collection("users").insertOne({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role || "user",
                        createdAt: new Date(),
                    });
                } else {
                    // Update user info if needed
                    await db.collection("users").updateOne(
                        { email: user.email },
                        {
                            $set: {
                                name: user.name,
                                image: user.image,
                                role: existingUser.role || 'user'
                            }
                        }
                    );
                    user.role = existingUser.role || "user";
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === 'update' && session) {
                token.name = session.user.name;
                token.picture = session.user.image;
                token.address = session.user.address;
                token.phone = session.user.phone;
                token.role = session.user.role;
            }

            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // console.log('444444444444444',token)
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.phone = token.phone;
                session.user.image = token.picture;
                session.user.address = token.address;
            }
            // console.log('55555555555555555',session)s
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
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