import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import React from "react";

type ToggleLikeCommentProps = {
	isLoggedIn: boolean;
	commentUUID: string;
};

const ToggleLikeComment = ({ isLoggedIn }: ToggleLikeCommentProps) => {
	return (
		<Button
			size="sm"
			variant="outline"
			className="aspect-square p-0 hover:text-red-500"
			disabled={!isLoggedIn}
			aria-disabled={!isLoggedIn}
		>
			<Heart className="w-4 h-4" />
		</Button>
	);
};

export default ToggleLikeComment;
