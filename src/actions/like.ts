"use server";

import { db } from "@/db";
import { postLikes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { toggleLikeToPostSchema } from "@/validators/like";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Response } from "./types";

export const toggleLikeToPost = async (
	formData: FormData,
): Promise<Response> => {
	const parsedFormData = toggleLikeToPostSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	const { postUUID } = parsedFormData.data;

	const session = await auth();
	if (!session) {
		return {
			success: false,
			error: "Not authenticated",
		};
	}

	try {
		const alreadyLikedRows = await db
			.select()
			.from(postLikes)
			.where(
				and(
					eq(postLikes.postUUID, postUUID),
					eq(postLikes.userId, session.user.id),
				),
			);

		const alreadyLiked = !!alreadyLikedRows[0];

		if (alreadyLiked) {
			const dislike = await db
				.delete(postLikes)
				.where(
					and(
						eq(postLikes.postUUID, postUUID),
						eq(postLikes.userId, session.user.id),
					),
				);
		} else {
			const like = await db.insert(postLikes).values({
				postUUID,
				userId: session.user.id,
			});
		}
		revalidatePath(`/posts/${postUUID}`);
		return {
			success: true,
		};
	} catch (err) {
		return {
			success: false,
			error: "Something went wrong",
		};
	}
};
