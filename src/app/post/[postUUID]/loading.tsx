import { Skeleton } from "@/components/ui/skeleton";

const LoadingPostPage = async () => {
	return (
		<div className="flex flex-col gap-8">
			<div className="w-full flex flex-col gap-4 border-b pb-5">
				<div className="flex items-center justify-between">
					<h1 className="text-4xl font-medium">
						<Skeleton className="w-[100px] h-[20px] rounded-lg" />
					</h1>
				</div>
				<p className="text-xl">
					<Skeleton className="w-[240px] h-[80px] rounded-lg" />
				</p>
				<span className="text-sm">
					<Skeleton className="w-[100px] h-[20px] rounded-lg" />
				</span>
			</div>
			<div className="flex flex-col gap-4">
				<h3 className="text-2xl font-semibold">Comments:</h3>
				<Skeleton className="w-[100px] h-[40px] rounded-lg" />
			</div>
		</div>
	);
};

export default LoadingPostPage;
