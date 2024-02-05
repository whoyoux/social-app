import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: "4MB" } })
		.middleware(async () => {
			const session = await auth();

			if (!session || !session.user) throw new UploadThingError("Unauthorized");

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);

			try {
				const fileSavedInDb = await db.insert(uploadedFiles).values({
					userId: metadata.userId,
					fileName: file.name,
					fileUrl: file.url,
				});
			} catch (err) {
				console.error("Error saving file to db", err);
				throw new UploadThingError("Error saving file to db");
			}

			console.log("file url", file.url);

			return { fileUrl: file.url, fileName: file.name };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
