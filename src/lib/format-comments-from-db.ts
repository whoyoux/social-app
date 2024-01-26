import { comments, users } from "@/db/schema";

type CommentType = typeof comments.$inferSelect;
type UserType = typeof users.$inferSelect;

type Comment = {
	user: UserType;
	comment: CommentType;
};

type CommentPropsWithChildren = {
	user: UserType;
	comment: CommentType & { children: CommentPropsWithChildren[] };
};

export const formatCommentsToEachParent = (commentsFromDB: Comment[]) => {
	const commentsWithChildren: CommentPropsWithChildren[] = commentsFromDB.map(
		(commentObj) => {
			return {
				user: commentObj.user,
				comment: {
					...commentObj.comment,
					children: [] as CommentPropsWithChildren[],
				},
			};
		},
	);

	// biome-ignore lint/complexity/noForEach: <explanation>
	commentsWithChildren.forEach((obj) => {
		if (!obj.comment.parentUUID) return;

		const parent = commentsWithChildren.find(
			(comment) => comment.comment.uuid === obj.comment.parentUUID,
		);
		if (!parent) return;

		parent.comment.children.push(obj);
	});

	const commentsToRender = commentsWithChildren.filter(
		(obj) => !obj.comment.parentUUID,
	);

	return commentsToRender;
};
