import { defaultStyles } from "@/config/default-styles";
import { cn } from "@/lib/utils";
import React from "react";
import { ThemeSwitcher } from "../theme-switcher";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
	return (
		<header
			className={cn(
				"border-b py-6 mb-10 flex justify-between items-center",
				defaultStyles.maxWidthWithPadding,
			)}
		>
			<Link href="/">
				<h1 className="text-2xl font-semibold tracking-tight">social app</h1>
			</Link>
			<nav className="flex gap-4 items-center">
				<Button variant="link">Register</Button>
				<Button>Login</Button>
				<ThemeSwitcher />
			</nav>
		</header>
	);
};

export default Header;
