import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

const providers = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    );
}

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers
}
