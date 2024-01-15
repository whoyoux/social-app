"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { createPost } from "@/actions/post";
import { createPostFormSchema } from "@/validators/post";
import { useState } from "react";

import { toast } from "sonner";

const CreatePost = () => {
	const [isCreating, setIsCreating] = useState(false);

	const form = useForm<z.infer<typeof createPostFormSchema>>({
		resolver: zodResolver(createPostFormSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	async function onSubmit(values: z.infer<typeof createPostFormSchema>) {
		if (isCreating) return; // prevent double submit

		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("content", values.content);

		setIsCreating(true);
		const result = await createPost(formData);
		setIsCreating(false);

		if (result.success) {
			form.reset();
			toast.success("Post created successfully");
		} else {
			toast.error(result.error);
		}

		console.log(result);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Enter a title" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
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
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isCreating} aria-disabled={isCreating}>
					Send
				</Button>
			</form>
		</Form>
	);
};

export default CreatePost;
