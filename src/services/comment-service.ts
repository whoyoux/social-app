import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getCommentsFromPost = async (postUUID: string) => {
	const result = await db
		.select()
		.from(comments)
		.where(eq(comments.postUUID, postUUID))
		.innerJoin(users, eq(comments.authorId, users.id))
		.orderBy(sql`${comments.createdAt} desc`);

	return result;
};
