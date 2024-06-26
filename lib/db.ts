import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

const sql = neon(DATABASE_URL);

export default sql;
