import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import { getServiceClient } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
    }),
    Credentials({
      id: "farcaster",
      name: "Farcaster",
      credentials: {
        fid: { label: "FID", type: "text" },
        username: { label: "Username", type: "text" },
        displayName: { label: "Display Name", type: "text" },
        pfpUrl: { label: "Profile Picture", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.fid || !credentials?.username) return null;
        return {
          id: `fc_${credentials.fid}`,
          name: credentials.username as string,
          image: (credentials.pfpUrl as string) || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const supabase = getServiceClient();

      if (account?.provider === "github" && profile) {
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
      } else if (account?.provider === "twitter" && profile) {
        const twitterId = `tw_${profile.data?.id || profile.id}`;
        const username = (profile.data?.username as string) || user.name || "unknown";

        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("github_id", twitterId)
          .single();

        if (!existing) {
          await supabase.from("users").insert({
            github_id: twitterId,
            username,
            name: (profile.data?.name as string) || user.name || null,
            avatar_url: user.image || null,
          });
        } else {
          await supabase
            .from("users")
            .update({
              username,
              name: (profile.data?.name as string) || user.name || null,
              avatar_url: user.image || null,
              updated_at: new Date().toISOString(),
            })
            .eq("github_id", twitterId);
        }
      } else if (account?.provider === "farcaster" && user.id) {
        const fcId = user.id;
        const username = user.name || "unknown";

        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("github_id", fcId)
          .single();

        if (!existing) {
          await supabase.from("users").insert({
            github_id: fcId,
            username,
            name: user.name || null,
            avatar_url: user.image || null,
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
            .eq("github_id", fcId);
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
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "github" && profile) {
        token.sub = String(profile.id);
      } else if (account?.provider === "twitter" && profile) {
        token.sub = `tw_${profile.data?.id || profile.id}`;
      } else if (account?.provider === "farcaster" && user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
