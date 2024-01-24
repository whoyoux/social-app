import CreatePost from "@/components/create-post";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { sql } from "drizzle-orm";
import { unstable_noStore } from "next/cache";
import Link from "next/link";

export default async function Home() {
	unstable_noStore();
	const postsRows = await db
		.select()
		.from(posts)
		.orderBy(sql`${posts.createdAt} desc`);
	return (
		<section>
			<CreatePost />
			<div className="py-10">
				<h2 className="text-2xl font-semibold">Posts</h2>
				<ul className="flex flex-col gap-4 mt-4">
					{postsRows.map((post) => (
						<li key={post.id} className="w-full border rounded-lg p-4">
							<Link href={`/post/${post.uuid}`}>
								<h3 className="text-xl font-medium">{post.title}</h3>
							</Link>
							<p className="mt-2 truncate max-w-[80vw]">{post.content}</p>
							<p className="mt-4">
								{new Date(post.createdAt).toLocaleString()}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
