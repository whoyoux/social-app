"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { addComment } from "@/actions/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { addCommentFormSchema } from "@/validators/comment";
import { toast } from "sonner";
import { useState } from "react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

const AddCommentDialog = ({
	postUUID,
	parentUUID,
	isLoggedIn,
}: { postUUID: string; parentUUID?: string; isLoggedIn: boolean }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const form = useForm<z.infer<typeof addCommentFormSchema>>({
		resolver: zodResolver(addCommentFormSchema),
		defaultValues: {
			content: "",
		},
	});

	async function onSubmit(values: z.infer<typeof addCommentFormSchema>) {
		if (isAdding) return;

		const formData = new FormData();
		formData.append("content", values.content);
		formData.append("postUUID", postUUID);
		if (parentUUID) formData.append("parentUUID", parentUUID);

		setIsAdding(true);
		const result = await addComment(formData);
		setIsAdding(false);

		if (result.success) {
			setIsDialogOpen(false);
			toast.success("Commented successfully 🎉");
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
					disabled={!isLoggedIn}
					aria-disabled={!isLoggedIn}
				>
					Reply
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a comment</DialogTitle>
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
										<Textarea placeholder="Leave a comment" {...field} />
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

export default AddCommentDialog;
