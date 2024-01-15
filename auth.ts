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
        console.log('profile= ', profile);
        console.log('token=', token);
        token.image = profile.picture;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = String(token.sub);
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
