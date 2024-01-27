import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

import DeletePostDialog from "@/components/post/delete-post-dialog";
import EditPostDialog from "@/components/post/edit-post-dialog";

import AddCommentForm from "@/components/comment/add-comment-form";

import Comment from "@/components/comment/comment";
import { formatCommentsToEachParent } from "@/lib/format-comments-from-db";
import { getCommentsFromPost } from "@/services/comment-service";
import { getPostWithUser } from "@/services/post-service";
import { unstable_noStore } from "next/cache";

const PostPage = async ({ params }: { params: { postUUID: string } }) => {
	unstable_noStore();
	const session = await auth();

	const postRows = await getPostWithUser(params.postUUID);
	if (!postRows || !postRows[0]) return notFound();
	const { post, user: author } = postRows[0];

	const isAuthor = session?.user?.id === author.id;
	const commentsFromDB = await getCommentsFromPost(params.postUUID);

	if (!commentsFromDB) return;
	const commentsToRender = formatCommentsToEachParent(commentsFromDB);

	const isCommentsEmpty = commentsFromDB.length === 0;

	return (
		<div className="flex flex-col gap-8">
			<div className="w-full flex flex-col gap-4 border-b pb-5">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<h1 className="text-4xl font-medium">{post.title}</h1>
						{post.edited && (
							<span className="text-muted-foreground">edited</span>
						)}
					</div>
					{isAuthor && (
						<div className="flex items-center gap-2">
							<EditPostDialog
								postUUID={post.uuid}
								initialContent={post.content}
								initialTitle={post.title}
							/>
							<DeletePostDialog postUUID={post.uuid} />
						</div>
					)}
				</div>
				<p className="text-xl">{post.content}</p>
				<span className="text-sm">
					{new Date(post.createdAt).toLocaleString()} by {author.name}
				</span>
				{/* <div className="flex gap-4">
					<Button
						variant="secondary"
						className="hover:bg-green-500 flex items-center gap-2 hover:text-white"
					>
						<span>999</span>
						<ThumbsUp />
					</Button>
					<Button
						variant="secondary"
						className="hover:bg-red-500 flex items-center gap-2 hover:text-white"
					>
						<span>999</span>
						<ThumbsDown />
					</Button>
				</div> */}
			</div>
			<div className="flex flex-col gap-4">
				<h3 className="text-2xl font-semibold">Comments:</h3>
				<AddCommentForm postUUID={post.uuid} isLoggedIn={!!session} />
				{!!commentsToRender && (
					<div className="flex flex-col gap-4">
						{isCommentsEmpty && (
							<h4 className="text-xl font-medium">No comments yet.</h4>
						)}
						{commentsToRender.map((comment) => (
							<Comment
								key={comment.comment.uuid}
								comment={comment.comment}
								user={comment.user}
								userId={session?.user?.id}
								isLoggedIn={!!session}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PostPage;
