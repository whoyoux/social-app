import { z } from "zod";

export const toggleLikeToPostSchema = z.object({
	postUUID: z.string().uuid(),
});
