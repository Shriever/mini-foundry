import { resolve } from "path";
import { runSql } from "./runSql";
const DB_URL = process.env.DB_URL;

(async () => {
    const file = resolve("migrations/0001_core.sql");
    await runSql({ dbUrl: DB_URL, file })
    console.log("Migration applied:", file);
})();