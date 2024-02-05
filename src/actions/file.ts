"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

import { auth } from "@/lib/auth";
import { deleteFileByFileUrl, getFileByFileUrl } from "@/services/file-service";
import { deleteFileFormSchema } from "@/validators/file";
import { Response } from "./types";

export const deleteFile = async (formData: FormData): Promise<Response> => {
	const parsedFormData = deleteFileFormSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			error: "Invalid form data",
		};
	}

	const { fileUrl } = parsedFormData.data;

	const session = await auth();

	if (!session || !session.user) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	// Get file name from file url, which is the last part of the url divided by /
	const fileKey = fileUrl.split("/").pop();

	if (!fileKey) {
		return {
			success: false,
			error: "Invalid file url",
		};
	}

	const fileInDb = await getFileByFileUrl(fileUrl);

	if (!fileInDb) {
		return {
			success: false,
			error: "File not found",
		};
	}

	if (fileInDb.userId !== session.user.id) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}
	try {
		await utapi.deleteFiles([fileKey]);
		await deleteFileByFileUrl(fileUrl);
	} catch (err) {
		console.error("Error deleting file", err);
		return {
			success: false,
			error: "Error deleting file",
		};
	}

	return {
		success: true,
	};
};
