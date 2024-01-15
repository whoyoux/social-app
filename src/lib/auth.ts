import { db } from "@/db";
import { pgTable } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const authConfig = {
	providers: [Discord],
	adapter: DrizzleAdapter(db, pgTable),
	callbacks: {
		async session({ session, user }) {
			session.user.id = user.id;
			return session;
		},
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
