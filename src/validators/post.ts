import * as z from "zod";

export const createPostFormSchema = z.object({
	title: z.string().min(2).max(50),
	content: z.string().min(10).max(500),
});
