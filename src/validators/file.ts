import { z } from "zod";

export const deleteFileFormSchema = z.object({
	fileUrl: z.string(),
});
