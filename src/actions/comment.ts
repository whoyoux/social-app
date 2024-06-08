"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
	addCommentToDBSchema,
	editCommentToDBSchema,
} from "@/validators/comment";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Response } from "./types";

export const addComment = async (formData: FormData): Promise<Response> => {
	const parsedFormData = addCommentToDBSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	const session = await auth();
	if (!session)
		return {
			success: false,
			error: "Not authenticated",
		};

	const { content, postUUID, parentUUID } = parsedFormData.data;

	try {
		await db.insert(comments).values({
			content,
			postUUID,
			parentUUID,
			authorId: session.user.id,
		});
		revalidatePath(`/post/${postUUID}`);
		return { success: true };
	} catch (err) {
		return {
			success: false,
			error: "Something went wrong. Please try again.",
		};
	}
};

export const editComment = async (formData: FormData) => {
	const parsedFormData = editCommentToDBSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	const session = await auth();
	if (!session)
		return {
			success: false,
			error: "Not authenticated",
		};

	const { content, commentUUID, postUUID } = parsedFormData.data;

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	try {
		const comment = await db
			.select()
			.from(comments)
			.where(eq(comments.authorId, session.user.id));

		if (!comment || !comment[0])
			return {
				success: false,
				error: "Comment not found",
			};

		await db
			.update(comments)
			.set({ content, edited: true })
			.where(eq(comments.uuid, commentUUID));

		revalidatePath(`/post/${postUUID}`);

		return { success: true };
	} catch (err) {
		return {
			success: false,
			error: "Something went wrong. Please try again.",
		};
	}
};

export const deleteComment = async (formData: FormData) => {
	const session = await auth();
	if (!session) return;

	const postUUID = (formData.get("postUUID") as string) || null;
	const commentUUID = (formData.get("commentUUID") as string) || null;
	if (!commentUUID || !postUUID) return;

	const result = await db
		.delete(comments)
		.where(eq(comments.uuid, commentUUID))
		.returning();
	console.log(result);

	revalidatePath(`/post/${postUUID}`);
};
