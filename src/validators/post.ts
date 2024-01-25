import * as z from "zod";

export const createPostFormSchema = z.object({
	title: z.string().min(2).max(50),
	content: z.string().min(10).max(2000),
	file: z.custom<File>((v) => v instanceof File).optional(),
});

export const updatePostFormSchema = z.object({
	title: z.string().min(2).max(50),
	content: z.string().min(10).max(2000),
});
