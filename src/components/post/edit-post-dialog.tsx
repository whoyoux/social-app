"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePostFormSchema } from "@/validators/post";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { updatePost } from "@/actions/post";

type EditPostDialogProps = {
	initialTitle: string;
	initialContent: string;
	postUUID: string;
};

const EditPostDialog = ({
	initialTitle,
	initialContent,
	postUUID,
}: EditPostDialogProps) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof updatePostFormSchema>>({
		resolver: zodResolver(updatePostFormSchema),
		defaultValues: {
			title: initialTitle,
			content: initialContent,
		},
	});

	async function onSubmit(values: z.infer<typeof updatePostFormSchema>) {
		if (isUpdating) return; // prevent double submit

		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("content", values.content);

		setIsUpdating(true);
		const result = await updatePost(formData, postUUID);
		setIsUpdating(false);

		if (result.success) {
			setIsDialogOpen(false);
			toast.success("Post updated successfully");
		} else {
			toast.error(result.error);
		}
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="secondary">
					<Pen />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit post</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mt-2"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter a title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea placeholder="What's on your mind?" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={isUpdating}
							aria-disabled={isUpdating}
						>
							Update
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditPostDialog;
