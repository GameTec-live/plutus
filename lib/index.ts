import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

// biome-ignore lint/style/noNonNullAssertion: We are sure that this will be set in the environment variables
export const db = drizzle(process.env.DATABASE_URL!);
