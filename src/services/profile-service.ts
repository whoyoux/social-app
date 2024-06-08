"server-only";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProfileByUserId = async (userId: string) => {
	try {
		const response = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.leftJoin(posts, eq(users.id, posts.authorId));

		const user = response[0].user;
		const userPosts = response
			.map((post) => post.post)
			.filter((post) => post !== null && post !== undefined);

		return {
			...user,
			posts: userPosts,
		};
	} catch (err) {
		//console.error("Error getting profile by user id: ", err);
		return null;
	}
};
