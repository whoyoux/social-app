import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_HOST) {
	throw new Error("DB_CONNECTION_STRING is missing");
}

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		host: process.env.POSTGRES_HOST ?? "",
		password: process.env.POSTGRES_PASSWORD ?? "",
		user: process.env.POSTGRES_USER ?? "",
		database: process.env.POSTGRES_DATABASE ?? "",
		ssl: true,
	},
	verbose: true,
	strict: true,
	tablesFilter: ["social-app_*"],
} satisfies Config;
