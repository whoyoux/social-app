import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/actions/post";

const DeletePostDialog = ({ postUUID }: { postUUID: string }) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="icon" variant="destructive">
					<Trash2 />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<form action={deletePost}>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							post.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<input type="hidden" name="postUUID" value={postUUID} />
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction type="submit">Delete</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeletePostDialog;
