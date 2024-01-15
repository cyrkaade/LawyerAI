import NextAuth, { type DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}


export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    // Configure the Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.picture; // Ensure this line is correctly fetching the picture from Google
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.sub as string;
        session.user.image = token.image as string | undefined; // Add this line to pass the avatar URL to the session
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
