"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createPost } from "@/actions/post";
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
import { createPostFormSchema } from "@/validators/post";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

import { deleteFile } from "@/actions/file";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { toast } from "sonner";

const CreatePost = () => {
	const [isCreating, setIsCreating] = useState(false);

	const [fileUrl, setFileUrl] = useState("");
	const [isFileUploading, setIsFileUploading] = useState(false);
	const [isFileRemoving, setIsFileRemoving] = useState(false);

	const form = useForm<z.infer<typeof createPostFormSchema>>({
		resolver: zodResolver(createPostFormSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	async function onSubmit(values: z.infer<typeof createPostFormSchema>) {
		if (isCreating) return; // prevent double submit

		if (isFileUploading) {
			toast.error("Please wait for the file to finish uploading");
			return;
		}

		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("content", values.content);
		formData.append("fileUrl", fileUrl);

		setIsCreating(true);
		const result = await createPost(formData);
		setIsCreating(false);

		if (result.success) {
			form.reset();
			setFileUrl("");
			toast.success("Post created successfully");
		} else {
			toast.error(result.error);
		}
	}

	async function deleteImage() {
		if (isFileRemoving) return;

		const formData = new FormData();
		formData.append("fileUrl", fileUrl);
		setIsFileRemoving(true);
		const res = await deleteFile(formData);
		setIsFileRemoving(false);
		if (res.success) {
			setFileUrl("");
			toast.success("Image removed successfully");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormItem>
					<FormLabel>Image</FormLabel>
					<FormControl>
						{
							<>
								{fileUrl ? (
									<div>
										<div className="w-full h-[500px] relative h-square">
											<Image
												src={fileUrl}
												alt="Uploaded file"
												fill
												className="rounded-lg bg-gray-500"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											/>
										</div>
										<Button
											className="mt-2"
											variant="destructive"
											onClick={deleteImage}
											type="button"
											disabled={isFileRemoving}
											aria-disabled={isFileRemoving}
										>
											Remove image
										</Button>
									</div>
								) : (
									<UploadDropzone
										endpoint="imageUploader"
										onUploadBegin={() => setIsFileUploading(true)}
										onUploadError={(err) => {
											setIsFileUploading(false);
											alert(`Failed to upload file. Error: ${err.message}`);
										}}
										onClientUploadComplete={(file) => {
											setIsFileUploading(false);
											setFileUrl(file[0].url);
										}}
										className="border rounded-lg border-border  ut-button:bg-primary ut-label:text-primary"
									/>
								)}
							</>
						}
					</FormControl>
					<FormDescription>We only accept image.</FormDescription>
				</FormItem>

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
