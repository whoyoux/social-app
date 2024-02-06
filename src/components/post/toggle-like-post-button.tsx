"use client";

import { toggleLikeToPost } from "@/actions/like";
import { cn } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";

import { useOptimistic } from "react";

type ToggleLikePostButtonProps = {
	postUUID: string;
	likesCount: number;
	didUserLike: boolean;
	isLoggedIn: boolean;
};

type OptimisticLike = {
	likesCount: number;
	didUserLike: boolean;
};

const ToggleLikePostButton = ({
	postUUID,
	likesCount,
	didUserLike,
	isLoggedIn,
}: ToggleLikePostButtonProps) => {
	const [optimisticState, setOptimisticState] = useOptimistic<OptimisticLike>({
		likesCount,
		didUserLike,
	});

	return (
		<form
			className="flex gap-4"
			action={async (formData) => {
				setOptimisticState({
					likesCount: didUserLike ? likesCount - 1 : likesCount + 1,
					didUserLike: !didUserLike,
				});

				await toggleLikeToPost(formData);
			}}
		>
			<input type="hidden" name="postUUID" value={postUUID} />
			<Button
				variant="secondary"
				size={optimisticState.likesCount > 0 ? "default" : "icon"}
				className={cn(
					"hover:bg-green-500 flex items-center gap-2 hover:text-white",
					optimisticState.didUserLike && "bg-green-500 text-background",
				)}
				disabled={!isLoggedIn}
				aria-disabled={!isLoggedIn}
			>
				{optimisticState.likesCount > 0 && (
					<span>{optimisticState.likesCount}</span>
				)}
				<ThumbsUp />
			</Button>
		</form>
	);
};

export default ToggleLikePostButton;
