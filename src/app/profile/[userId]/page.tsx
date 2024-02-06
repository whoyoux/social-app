import Post from "@/components/post/post";
import { auth } from "@/lib/auth";
import { getProfileByUserId } from "@/services/profile-service";
import Image from "next/image";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
	const profile = await getProfileByUserId(params.userId);
	if (!profile) return notFound();

	profile.posts.sort((a, b) =>
		a?.createdAt && b?.createdAt
			? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			: 0,
	);

	const hasUserPosts = profile.posts.length > 0;

	return (
		<div>
			<section className="w-full">
				{profile.image && (
					<div className="max-w-[200px] mx-auto aspect-square">
						<Image
							src={profile.image}
							alt="Profile picture"
							className="rounded-lg"
							priority
							width={200}
							height={200}
						/>
					</div>
				)}
				<h1 className="text-4xl font-medium text-center mt-4">
					{profile.name}
				</h1>
			</section>
			<section className="flex flex-col gap-4 mt-10">
				{hasUserPosts &&
					profile.posts.map((post) => {
						if (!post) return null;
						return <Post key={post.uuid} post={post} />;
					})}
				{!hasUserPosts && <h2>User has 0 posts.</h2>}
			</section>
		</div>
	);
};

export default ProfilePage;
