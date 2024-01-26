import { comments, users } from "@/db/schema";
import { auth } from "@/lib/auth";

import { cn } from "@/lib/utils";

type Comment = typeof comments.$inferSelect;
type User = typeof users.$inferSelect;

type CommentPropsWithChildren = {
	user: User;
	comment: Comment & { children: CommentPropsWithChildren[] };
};

import AddCommentDialog from "@/components/add-comment-dialog";
import DeleteCommentDialog from "@/components/delete-comment-dialog";

const Comment = async ({ comment, user }: CommentPropsWithChildren) => {
	const isReply = !!comment.parentUUID;

	const session = await auth();
	const isAuthor = session?.user?.id === user.id;

	return (
		<div
			className={cn(
				isReply && "ml-10",
				"border-l px-4 my-2 flex flex-col gap-2",
			)}
		>
			<p className="text-normal">{comment.content}</p>

			<span className="text-sm">
				{new Date(comment.createdAt).toLocaleString()} by {user.name}
			</span>

			<div className="flex items-center gap-2">
				{session && (
					<AddCommentDialog
						postUUID={comment.postUUID}
						parentUUID={comment.uuid}
					/>
				)}

				{isAuthor && (
					<DeleteCommentDialog
						commentUUID={comment.uuid}
						postUUID={comment.postUUID}
					/>
				)}
			</div>

			{comment.children.length > 0 &&
				comment.children.map((child) => (
					<Comment
						key={child.comment.uuid}
						comment={child.comment}
						user={child.user}
					/>
				))}
		</div>
	);
};

export default Comment;
