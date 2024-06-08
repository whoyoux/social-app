"server-only";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getPosts = async () => {
	const postsRows = await db
		.select()
		.from(posts)
		.orderBy(sql`${posts.createdAt} desc`);

	return postsRows;
};

export const getPostWithUser = async (postUUID: string) => {
	const postRows = await db
		.select()
		.from(posts)
		.where(eq(posts.uuid, postUUID))
		.innerJoin(users, eq(posts.authorId, users.id));

	return postRows;
};
