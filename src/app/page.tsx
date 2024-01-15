import { ThemeSwitcher } from "@/components/theme-switcher";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export default async function Home() {
	const accountsFound = await db.select().from(accounts);
	console.log(accountsFound);
	return <section>home page</section>;
}
