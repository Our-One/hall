import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { getDb } from "@/db/client";
import { users, accounts, sessions, verificationTokens } from "@/db/external/auth";
import { eq } from "drizzle-orm";
import { emailLayout, emailButton } from "@/lib/email/template";
import { createLogger } from "@/lib/logger";

const authLogger = createLogger("auth");

const isDev = process.env.NODE_ENV === "development";

const providers = [
  // Email magic link (production)
  ...(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_dev_placeholder"
    ? [Resend({
        apiKey: process.env.RESEND_API_KEY,
        from: "Our.one <hello@our.one>",
        async sendVerificationRequest({ identifier: email, url, provider }) {
          const { Resend: ResendClient } = await import("resend");
          const resend = new ResendClient(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: provider.from ?? "Our.one <hello@our.one>",
            to: email,
            subject: "Sign in to Our.one",
            html: emailLayout(`
              <p>Sign in to <strong>our.one</strong></p>
              ${emailButton("Sign in", url)}
              <p style="font-size: 13px; color: #6B6B6B;">If you did not request this email you can safely ignore it.</p>
            `),
          });
        },
      })]
    : []),

  // OAuth providers (GitHub / Google / LinkedIn) intentionally NOT configured
  // here. Hall delegates OAuth sign-in to our.one's /cross-signin proxy:
  // user clicks "Sign in with GitHub" on Hall → redirected to our.one →
  // OAuth flow completes there → cookie set on .our.one (shared) → user
  // returns to Hall already signed in.
  //
  // This keeps Our.one's portfolio with a single OAuth App per provider,
  // managed centrally on our.one, instead of one App per subdomain.
  // Magic-link (Resend) and dev login below stay local to Hall.

  // Dev-only: sign in with any email, no verification
  ...(isDev
    ? [
        Credentials({
          id: "dev-login",
          name: "Dev Login",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "dev@our.one" },
          },
          async authorize(credentials) {
            if (!isDev) return null;
            const email = credentials?.email as string;
            if (!email) return null;

            const db = getDb();

            // Find or create user
            let user = await db.query.users.findFirst({
              where: eq(users.email, email),
            });

            if (!user) {
              const [created] = await db
                .insert(users)
                .values({ email, name: email.split("@")[0], emailVerified: new Date() })
                .returning();
              user = created;
            }

            return { id: user.id, email: user.email, name: user.name };
          },
        }),
      ]
    : []),
];

const db = process.env.DATABASE_URL ? getDb() : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: db ? DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) : undefined,
  providers,
  session: {
    // Credentials provider requires JWT strategy
    strategy: isDev ? "jwt" : "database",
    // Constitutional: "session-only cookies" — 24h server-side TTL,
    // but cookie has no maxAge so it expires when the browser closes.
    maxAge: 24 * 60 * 60, // 24 hours server-side session lifetime
  },
  cookies: {
    // Cross-subdomain cookies for our.one SSO.
    // Cookie scoped to .our.one is shared across our.one, hall.our.one,
    // and every future flagship subdomain. Combined with shared DATABASE_URL
    // and shared AUTH_SECRET, sign-in on any our.one app signs you in on
    // all of them.
    sessionToken: {
      name: isDev ? "next-auth.session-token" : "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: !isDev,
        domain: isDev ? undefined : ".our.one",
        // No maxAge — cookie expires when browser closes (session-only).
        // Constitutional compliance: "Session-only cookies. No behavioral tracking."
      },
    },
    callbackUrl: {
      name: isDev ? "next-auth.callback-url" : "__Secure-next-auth.callback-url",
      options: {
        sameSite: "lax" as const,
        path: "/",
        secure: !isDev,
        domain: isDev ? undefined : ".our.one",
      },
    },
    csrfToken: {
      name: isDev ? "next-auth.csrf-token" : "__Host-next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: !isDev,
        // CSRF token MUST stay host-scoped (no domain) to keep the
        // __Host- prefix valid in production. Each app validates its
        // own CSRF tokens; that's fine and correct.
      },
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    jwt({ token, user }) {
      // On initial sign-in, persist user id into the JWT
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, user, token }) {
      if (session.user) {
        // JWT mode (dev): id comes from token
        // Database mode (prod): id comes from user
        session.user.id = user?.id ?? token?.sub ?? "";
      }
      return session;
    },
  },
});
