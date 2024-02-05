import * as z from "zod";

export const deleteFileFormSchema = z.object({
	fileUrl: z.string(),
});
