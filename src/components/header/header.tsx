import { Button } from "@/components/ui/button";
import { defaultStyles } from "@/config/default-styles";
import { auth, signIn, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ThemeSwitcher } from "../theme-switcher";

const Header = async () => {
	const session = await auth();

	const isUserLoggedIn = !!session?.user;

	return (
		<div className={defaultStyles.maxWidthWithPadding}>
			<header
				className={cn("border-b py-6 mb-10 flex justify-between items-center")}
			>
				<Link href="/">
					<h1 className="text-2xl font-semibold tracking-tight">social app</h1>
				</Link>
				<nav className="flex gap-4 items-center">
					{isUserLoggedIn && (
						<Link href={`/profile/${session?.user?.id}`}>
							<Button variant="link">My account</Button>
						</Link>
					)}
					{isUserLoggedIn ? <SignOutButton /> : <SignInButton />}

					<ThemeSwitcher />
				</nav>
			</header>
		</div>
	);
};

const SignOutButton = async () => {
	return (
		<form
			action={async () => {
				"use server";
				await signOut({ redirectTo: "/" });
			}}
		>
			<Button type="submit">Sign out</Button>
		</form>
	);
};

const SignInButton = async () => {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("discord");
			}}
		>
			<Button type="submit">Login</Button>
		</form>
	);
};

export default Header;
