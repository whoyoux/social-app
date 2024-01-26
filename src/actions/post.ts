"use server";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { utapi } from "@/server/uploadthing";
import { createPostFormSchema, updatePostFormSchema } from "@/validators/post";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Response } from "./types";

export const createPost = async (formData: FormData): Promise<Response> => {
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

	const { title, content, file } = parsedFormData.data;

	let url: string | undefined;

	// if (file) {
	// 	try {
	// 		const res = await utapi.uploadFiles([file], {
	// 			metadata: {
	// 				authorId: session.user.id,
	// 			},
	// 		});

	// 		url = res[0].data?.url;
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// }

	const result = await db
		.insert(posts)
		.values({
			title,
			content,
			fileUrl: url,
			authorId: session.user.id,
		})
		.returning();

	console.log(result);

	revalidatePath("/");

	return { success: true };
};

export const deletePost = async (formData: FormData) => {
	const postUUID = formData.get("postUUID") as string;
	if (!postUUID) return;
	const session = await auth();

	if (!session) return;

	const postRows = await db
		.select()
		.from(posts)
		.where(eq(posts.uuid, postUUID))
		.innerJoin(users, eq(posts.authorId, users.id));

	if (!postRows || !postRows[0]) return;
	if (postRows[0].user.id !== session.user.id) return;

	await db.delete(posts).where(eq(posts.uuid, postUUID));
	redirect("/account");
};

export const updatePost = async (
	formData: FormData,
	postUUID: string,
): Promise<Response> => {
	const parsedFormData = updatePostFormSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	if (!postUUID || typeof postUUID !== "string") {
		return {
			success: false,
			error: "Invalid post UUID",
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

	const postRows = await db
		.select()
		.from(posts)
		.where(eq(posts.uuid, postUUID))
		.innerJoin(users, eq(posts.authorId, users.id));

	if (!postRows || !postRows[0]) {
		return {
			success: false,
			error: "Post not found",
		};
	}

	if (postRows[0].user.id !== session.user.id) {
		return {
			success: false,
			error: "Not authorized",
		};
	}

	await db
		.update(posts)
		.set({
			title,
			content,
			edited: true,
		})
		.where(eq(posts.uuid, postUUID));

	revalidatePath(`/posts/${postUUID}`);

	return { success: true };
};
