"server-only";

import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getFileByFileUrl = async (fileUrl: string) => {
	const fileInDb = await db
		.select()
		.from(uploadedFiles)
		.where(eq(uploadedFiles.fileUrl, fileUrl));
	return fileInDb[0];
};

export const deleteFileByFileUrl = async (fileUrl: string) => {
	await db.delete(uploadedFiles).where(eq(uploadedFiles.fileUrl, fileUrl));
};
