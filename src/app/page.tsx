import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Home() {
	// const accountsFound = await db.select().from(users);
	// console.log(accountsFound);
	return <section>home page</section>;
}
