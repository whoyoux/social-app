import { z } from "zod";

export const editDescSchema = z.object({
	description: z.string().min(2).max(500),
});
