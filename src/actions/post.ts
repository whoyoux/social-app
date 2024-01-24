"use server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { utapi } from "@/server/uploadthing";
import { createPostFormSchema } from "@/validators/post";
import { revalidatePath } from "next/cache";

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
