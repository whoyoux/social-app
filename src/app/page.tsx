import CreatePost from "@/components/post/create-post";
import Post from "@/components/post/post";
import { auth } from "@/lib/auth";
import { getPosts } from "@/services/post-service";
import { unstable_noStore } from "next/cache";

export default async function Home() {
	unstable_noStore();
	const postsRows = await getPosts();

	const session = await auth();
	return (
		<section className="flex flex-col gap-8">
			{session && <CreatePost />}
			<div className="">
				<h2 className="text-2xl font-semibold">Posts</h2>
				<div className="flex flex-col gap-4 mt-4">
					{postsRows.map((post) => (
						<Post key={post.uuid} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}
