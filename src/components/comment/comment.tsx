import { comments, users } from "@/db/schema";

import { cn } from "@/lib/utils";

type Comment = typeof comments.$inferSelect;
type User = typeof users.$inferSelect;

type CommentPropsWithChildren = {
	user: User;
	comment: Comment & { children: CommentPropsWithChildren[] };
};

import AddCommentDialog from "@/components/comment/add-comment-dialog";
import DeleteCommentDialog from "@/components/comment/delete-comment-dialog";
import Image from "next/image";

type CommentProps = {
	userId: string | undefined;
	isLoggedIn: boolean;
} & CommentPropsWithChildren;

const Comment = ({ comment, user, userId, isLoggedIn }: CommentProps) => {
	const isReply = !!comment.parentUUID;

	const hasReplies = comment.children.length > 0;

	const isAuthor = userId === user.id;

	return (
		<div
			className={cn(
				isReply && "ml-4",
				"border-l px-4 my-2 flex flex-col gap-2",
			)}
		>
			<div className="flex flex-row items-center gap-4 items-strech">
				{/* <img src={user.image ?? ""} alt="user img" className="w-8 h-8" /> */}
				<Image src={user.image ?? ""} alt="user img" width={24} height={24} />
				<div>
					<p className="text-xl">{comment.content}</p>

					<span className="text-sm">
						{new Date(comment.createdAt).toLocaleString()} by{" "}
						<span className={cn(isAuthor && "text-green-500 font-medium")}>
							{user.name}
						</span>
					</span>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{isLoggedIn && (
					<AddCommentDialog
						postUUID={comment.postUUID}
						parentUUID={comment.uuid}
						isLoggedIn={isLoggedIn}
					/>
				)}

				{isAuthor && (
					<DeleteCommentDialog
						commentUUID={comment.uuid}
						postUUID={comment.postUUID}
					/>
				)}
			</div>

			{hasReplies &&
				comment.children.map((child) => (
					<Comment
						key={child.comment.uuid}
						comment={child.comment}
						user={child.user}
						userId={userId}
						isLoggedIn={isLoggedIn}
					/>
				))}
		</div>
	);
};

export default Comment;
