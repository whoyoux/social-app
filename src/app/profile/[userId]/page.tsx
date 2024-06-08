import Post from "@/components/post/post";
import EditDescriptionDialog from "@/components/profile/edit-description-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/auth";
import { getProfileByUserId } from "@/services/profile-service";
import Image from "next/image";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
	const profile = await getProfileByUserId(params.userId);
	if (!profile) return notFound();

	const session = await auth();

	profile.posts.sort((a, b) =>
		a?.createdAt && b?.createdAt
			? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			: 0,
	);

	const isMyProfile = session?.user?.id === profile.id;

	const hasUserPosts = profile.posts.length > 0;

	return (
		<div>
			<section className="w-full flex flex-col md:flex-row gap-4">
				{profile.image && (
					<div className="max-w-[125px] aspect-square">
						<Image
							src={profile.image}
							alt="Profile picture"
							className="rounded-lg"
							priority
							width={125}
							height={125}
						/>
					</div>
				)}
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-medium">{profile.name}</h1>
					{/* <Textarea placeholder="your desc...." /> */}
					<p className="text-muted-foreground">{profile.description}</p>
					{isMyProfile && (
						<EditDescriptionDialog initialDesc={profile.description} />
					)}
				</div>
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
