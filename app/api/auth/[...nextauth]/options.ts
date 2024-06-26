import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"
import NextAuth, {
    GhExtendedProfile,
    NextAuthOptions,
    Session
} from "next-auth"
import { CLIENT_ID, CLIENT_SECRET } from "@/utils/configs"

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        })
    ],
    pages: {
        signIn: "/sign-in"
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token
                token.profile = profile
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.accessToken) {
                session.accessToken = token.accessToken as string
                const { login } = token.profile as GhExtendedProfile
                session.user.login = login
            }
            return session
        }
    }
}

export default NextAuth(authOptions)
