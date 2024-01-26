import CreatePost from "@/components/post/create-post";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

const AccountPage = async () => {
	const session = await auth();
	if (!session) redirect("/");
	const myPostsRows = await db
		.select()
		.from(posts)
		.where(eq(posts.authorId, session.user.id))
		.orderBy(sql`${posts.createdAt} desc`);
	return (
		<div>
			<CreatePost />
			<div className="mt-10">
				<h1 className="text-4xl font-semibold">My posts</h1>
				<ul className="flex flex-col gap-2 mt-8">
					{myPostsRows.map((post) => (
						<li key={post.id}>
							<Link
								href={`/post/${post.uuid}`}
								className={cn(
									buttonVariants({ variant: "secondary" }),
									"w-full",
								)}
							>
								{post.title}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default AccountPage;
