import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { getServiceClient } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const supabase = getServiceClient();
        const githubId = String(profile.id);
        const username = (profile.login as string) || user.name || "unknown";

        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("github_id", githubId)
          .single();

        if (!existing) {
          await supabase.from("users").insert({
            github_id: githubId,
            username,
            name: user.name || null,
            avatar_url: user.image || null,
            email: user.email || null,
          });
        } else {
          await supabase
            .from("users")
            .update({
              username,
              name: user.name || null,
              avatar_url: user.image || null,
              updated_at: new Date().toISOString(),
            })
            .eq("github_id", githubId);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        const supabase = getServiceClient();
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, username, balance, avatar_url")
          .eq("github_id", token.sub)
          .single();

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.name = dbUser.username;
          session.user.balance = dbUser.balance;
          session.user.image = dbUser.avatar_url;
        }
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.sub = String(profile.id);
      }
      return token;
    },
  },
});
