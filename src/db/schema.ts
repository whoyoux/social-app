import {
	timestamp,
	pgTableCreator,
	text,
	primaryKey,
	integer,
	uuid,
	bigserial,
	boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const pgTable = pgTableCreator((name) => `social-app_${name}`);

export const posts = pgTable("post", {
	id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
	uuid: uuid("uuid").defaultRandom().notNull().unique(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	fileUrl: text("file_url"),
	edited: boolean("edited").notNull().default(false),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const comments = pgTable("comment", {
	id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
	uuid: uuid("uuid").defaultRandom().notNull().unique(),
	content: text("content").notNull(),
	edited: boolean("edited").notNull().default(false),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	postUUID: uuid("post_uuid")
		.notNull()
		.references(() => posts.uuid, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),

	parentUUID: uuid("parent_uuid"),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	parent: one(comments, {
		fields: [comments.parentUUID],
		references: [comments.uuid],
	}),
}));

export const postLikes = pgTable(
	"post_like",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		postUUID: uuid("post_uuid")
			.notNull()
			.references(() => posts.uuid, { onDelete: "cascade" }),
	},
	(like) => {
		return {
			compoundKey: primaryKey({ columns: [like.userId, like.postUUID] }),
		};
	},
);

export const commentLikes = pgTable(
	"comment_like",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		commentUUID: uuid("comment_uuid")
			.notNull()
			.references(() => comments.uuid, { onDelete: "cascade" }),
	},
	(like) => {
		return {
			compoundKey: primaryKey({ columns: [like.userId, like.commentUUID] }),
		};
	},
);

export const users = pgTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
});

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	}),
);
