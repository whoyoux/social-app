"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";

import { updatePostFormSchema } from "@/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { updatePost } from "@/actions/post";
import { editDesc } from "@/actions/profile";
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
import { editDescSchema } from "@/validators/profile";
import { useState } from "react";
import { toast } from "sonner";

type EditDescriptionDialogProps = {
	initialDesc: string | null;
};

const EditDescriptionDialog = (props: EditDescriptionDialogProps) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof editDescSchema>>({
		resolver: zodResolver(editDescSchema),
		defaultValues: {
			description: props.initialDesc ?? "",
		},
	});

	async function onSubmit(values: z.infer<typeof editDescSchema>) {
		if (isUpdating) return; // prevent double submit

		const formData = new FormData();
		formData.append("description", values.description);

		setIsUpdating(true);
		const result = await editDesc(formData);
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
					<DialogTitle>Edit description</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mt-2"
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Enter a description" {...field} />
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

export default EditDescriptionDialog;
