"use client";

import { useState } from "react";

import AddCommentDialog from "@/components/comment/add-comment-dialog";
import DeleteCommentDialog from "@/components/comment/delete-comment-dialog";
import { Button } from "@/components/ui/button";

import { comments, users } from "@/db/schema";

import { cn } from "@/lib/utils";
import Image from "next/image";
import EditCommentDialog from "./edit-comment-dialog";

type Comment = typeof comments.$inferSelect;
type User = typeof users.$inferSelect;

type CommentPropsWithChildren = {
	user: User;
	comment: Comment & { children: CommentPropsWithChildren[] };
};

type CommentProps = {
	userId: string | undefined;
	isLoggedIn: boolean;
} & CommentPropsWithChildren;

const Comment = ({ comment, user, userId, isLoggedIn }: CommentProps) => {
	const isReply = !!comment.parentUUID;
	const hasReplies = comment.children.length > 0;

	const [showReplies, setShowReplies] = useState(false);

	const isAuthor = userId === user.id;

	return (
		<div
			className={cn(
				isReply && "ml-4",
				"px-4 my-2 flex flex-col gap-2 min-w-[300px]",
				hasReplies && "border-l",
			)}
		>
			<div className="flex flex-row gap-4 items-start">
				<div className="w-full aspect-square max-w-[32px] relative">
					<Image
						src={user.image ?? ""}
						alt="user img"
						fill
						sizes="32px"
						className="rounded-lg"
					/>
				</div>

				<div suppressHydrationWarning>
					<p className="text-xl">{comment.content}</p>

					<div className="text-sm mt-2" suppressHydrationWarning>
						{comment.edited && (
							<span className="text-muted-foreground">edited</span>
						)}{" "}
						{new Date(comment.createdAt).toLocaleString()} by{" "}
						<span className={cn(isAuthor && "text-green-500", "font-medium")}>
							{user.name}
						</span>
					</div>
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
					<>
						<EditCommentDialog
							commentUUID={comment.uuid}
							postUUID={comment.postUUID}
							initialContentValue={comment.content}
							isLoggedIn={isLoggedIn}
						/>
						{/* <ToggleLikeComment
							isLoggedIn={isLoggedIn}
							commentUUID={comment.uuid}
						/> */}
						<DeleteCommentDialog
							commentUUID={comment.uuid}
							postUUID={comment.postUUID}
						/>
					</>
				)}
			</div>
			{}

			<div>
				{hasReplies &&
					(showReplies ? (
						<Button variant="link" onClick={() => setShowReplies(false)}>
							Hide replies
						</Button>
					) : (
						<Button variant="link" onClick={() => setShowReplies(true)}>
							Show replies
						</Button>
					))}
			</div>

			{hasReplies &&
				showReplies &&
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
