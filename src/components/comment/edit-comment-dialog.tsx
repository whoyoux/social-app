"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { addComment, editComment } from "@/actions/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { editCommentFormSchema } from "@/validators/comment";
import { useState } from "react";
import { toast } from "sonner";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Pen } from "lucide-react";

const EditCommentDialog = ({
	commentUUID,
	postUUID,
	isLoggedIn,
	initialContentValue,
}: {
	commentUUID: string;
	postUUID: string;
	isLoggedIn: boolean;
	initialContentValue: string;
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const form = useForm<z.infer<typeof editCommentFormSchema>>({
		resolver: zodResolver(editCommentFormSchema),
		defaultValues: {
			content: initialContentValue,
		},
	});

	async function onSubmit(values: z.infer<typeof editCommentFormSchema>) {
		if (isAdding) return;

		const formData = new FormData();
		formData.append("content", values.content);
		formData.append("commentUUID", commentUUID);
		formData.append("postUUID", postUUID);

		setIsAdding(true);
		const result = await editComment(formData);
		setIsAdding(false);

		if (result.success) {
			setIsDialogOpen(false);
			toast.success("Comment edited successfully 🎉");
		} else {
			toast.error(result.error);
		}
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					variant="outline"
					className="aspect-square p-0"
					disabled={!isLoggedIn}
					aria-disabled={!isLoggedIn}
				>
					<Pen className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit a comment</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mt-2"
					>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Leave a comment"
											{...field}
											rows={5}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-32">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditCommentDialog;
