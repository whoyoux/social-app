"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { editDescSchema } from "@/validators/profile";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Response } from "./types";

export const editDesc = async (formData: FormData): Promise<Response> => {
	const parsedFormData = editDescSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	const { description } = parsedFormData.data;

	const session = await auth();
	if (!session) {
		return {
			success: false,
			error: "Not authenticated",
		};
	}

	try {
		const updateDesc = await db
			.update(users)
			.set({ description })
			.where(eq(users.id, session.user.id));
		revalidatePath(`/profile/${session.user.id}`);
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
