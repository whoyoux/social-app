import { Button } from "@/components/ui/button";
import type { posts } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

type PostProps = {
	post: InferSelectModel<typeof posts>;
};

const Post = ({ post }: PostProps) => {
	return (
		<div className="w-full border rounded-lg p-8 bg-card">
			<Link href={`/post/${post.uuid}`}>
				<h3 className="text-2xl font-medium hover:underline">{post.title}</h3>
			</Link>
			{post.edited && <h4 className="text-sm text-muted-foreground">edited</h4>}
			{post.fileUrl && (
				<div className="w-full relative aspect-video max-w-screen-md my-8">
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
			<p className="mt-2 truncate max-w-[80vw]">{post.content}</p>
			<p className="mt-4">{new Date(post.createdAt).toLocaleString()}</p>
		</div>
	);
};

export default Post;
