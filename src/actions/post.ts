"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createPostFormSchema } from "@/validators/post";

export type ResponseCreatePost =
	| {
			success: true;
	  }
	| {
			success: false;
			error: string;
	  };

export const createPost = async (
	formData: FormData,
): Promise<ResponseCreatePost> => {
	const parsedFormData = createPostFormSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	const session = await auth();
	if (!session) {
		return {
			success: false,
			error: "Not authenticated",
		};
	}

	const { title, content } = parsedFormData.data;

	const result = await db
		.insert(posts)
		.values({
			title,
			content,
			authorId: session.user.id,
		})
		.returning();

	return { success: true };
};
