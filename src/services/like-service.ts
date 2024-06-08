"server-only";
import { db } from "@/db";
import { postLikes } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const getLikesFromPost = async (postUUID: string) => {
	const likesRows = await db
		.select()
		.from(postLikes)
		.where(eq(postLikes.postUUID, postUUID));
	const likesCount = likesRows.length;

	return likesCount;
};

export const checkIfUserLikedPost = async (
	postUUID: string,
	userId: string,
): Promise<boolean> => {
	const userLike = await db
		.select()
		.from(postLikes)
		.where(and(eq(postLikes.postUUID, postUUID), eq(postLikes.userId, userId)));

	return !!userLike[0];
};
