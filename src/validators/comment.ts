import * as z from "zod";

export const addCommentFormSchema = z.object({
	content: z.string().min(5).max(1000),
});

export const addCommentToDBSchema = z.object({
	content: z.string().min(5).max(1000),
	postUUID: z.string(),
	parentUUID: z.string().optional(),
});

export const deleteCommentSchema = z.object({
	postUUID: z.string(),
	commentUUID: z.string().optional(),
});

export const editCommentFormSchema = addCommentFormSchema;

export const editCommentToDBSchema = z.object({
	content: z.string().min(5).max(1000),
	commentUUID: z.string(),
	postUUID: z.string(),
});
