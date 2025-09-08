import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "../../../services/authservice";

// Export your config as authOptions
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                usernameOrEmail: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.usernameOrEmail || !credentials?.password) {
                    return null;
                }
                try {
                    const { user } = await AuthService.login(
                        credentials.usernameOrEmail,
                        credentials.password
                    );
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        roleId: user.roleId,
                    };
                } catch (error) {
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    session: {
        strategy: "jwt"  as const,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.roleId = user.roleId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.roleId = token.roleId as string;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };