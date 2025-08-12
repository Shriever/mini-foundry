import { runSql } from "./runSql";
export async function query(sql: string) {
    await runSql({ dbUrl: process.env.DB_URL!, sql })
}