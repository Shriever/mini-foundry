import { runSqlFn, runSqlOptions } from "../../src/types/store";

export function mockRunSql(opts: runSqlOptions): Promise<void>  {
    return new Promise((resolve, reject) => {
        resolve();
    })
}