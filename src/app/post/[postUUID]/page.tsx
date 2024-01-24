import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";

const PostPage = async ({ params }: { params: { postUUID: string } }) => {
	const postRows = await db
		.select()
		.from(posts)
		.where(eq(posts.uuid, params.postUUID))
		.innerJoin(users, eq(posts.authorId, users.id));

	if (!postRows || !postRows[0]) return notFound();

	const { post, user: author } = postRows[0];

	const session = await auth();

	const isAuthor = session?.user?.id === author.id;

	const deletePost = async (formData: FormData) => {
		"use server";

		const postUUID = formData.get("postUUID") as string;
		const session = await auth();

		if (!session) return;

		const postRows = await db
			.select()
			.from(posts)
			.where(eq(posts.uuid, postUUID))
			.innerJoin(users, eq(posts.authorId, users.id));

		if (!postRows || !postRows[0]) return;
		if (postRows[0].user.id !== session.user.id) return;

		await db.delete(posts).where(eq(posts.uuid, postUUID));
		redirect("/account");
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="w-full flex flex-col gap-4 border-b pb-5">
				<div className="flex items-center justify-between">
					<h1 className="text-4xl font-medium">{post.title}</h1>
					{isAuthor && (
						<form action={deletePost}>
							<input type="hidden" name="postUUID" value={post.uuid} />
							<Button size="icon" variant="destructive">
								<Trash2 />
							</Button>
						</form>
					)}
				</div>
				<p className="text-xl">{post.content}</p>
				<span className="text-sm">
					{new Date(post.createdAt).toLocaleString()} by {author.name}
				</span>
				<div className="flex gap-4">
					<Button
						size="icon"
						variant="secondary"
						className="hover:bg-green-500"
					>
						<ThumbsUp />
					</Button>
					<Button size="icon" variant="secondary" className="hover:bg-red-500">
						<ThumbsDown />
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<h3 className="text-2xl font-semibold">Comments:</h3>
				<ul>
					<h4 className="text-xl font-medium">No comments yet.</h4>
				</ul>
			</div>
		</div>
	);
};

export default PostPage;
