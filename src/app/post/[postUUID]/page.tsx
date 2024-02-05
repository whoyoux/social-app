import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

import DeletePostDialog from "@/components/post/delete-post-dialog";
import EditPostDialog from "@/components/post/edit-post-dialog";

import AddCommentForm from "@/components/comment/add-comment-form";

import Comment from "@/components/comment/comment";
import ToggleLikePostButton from "@/components/post/toggle-like-post-button";
import { formatCommentsToEachParent } from "@/lib/format-comments-from-db";
import { getCommentsFromPost } from "@/services/comment-service";
import {
	checkIfUserLikedPost,
	getLikesFromPost,
} from "@/services/like-service";
import { getPostWithUser } from "@/services/post-service";
import { unstable_noStore } from "next/cache";
import Image from "next/image";

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

	const likesCount = await getLikesFromPost(post.uuid);

	let didUserLike = false;
	if (session) {
		didUserLike = await checkIfUserLikedPost(post.uuid, session.user.id);
	}

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
				{post.fileUrl && (
					<div className="w-full relative h-[500px] max-w-screen-md">
						<Image
							src={post.fileUrl}
							alt={post.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="rounded-lg object-cover"
							quality={100}
						/>
					</div>
				)}
				<p className="text-xl">{post.content}</p>
				<span className="text-sm">
					{new Date(post.createdAt).toLocaleString()} by {author.name}
				</span>
				<ToggleLikePostButton
					postUUID={post.uuid}
					likesCount={likesCount}
					didUserLike={didUserLike}
				/>
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
