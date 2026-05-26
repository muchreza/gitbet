import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { getServiceClient } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && profile) {
        const supabase = getServiceClient();
        const twitterId = account.providerAccountId;
        const twitterProfile = profile as Record<string, unknown>;
        const profileData = (twitterProfile.data ?? twitterProfile) as Record<string, unknown>;
        const username =
          String(profileData.username ?? user.name ?? "unknown");

        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("github_id", twitterId)
          .single();

        if (!existing) {
          await supabase.from("users").insert({
            github_id: twitterId,
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
            .eq("github_id", twitterId);
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
    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
});
