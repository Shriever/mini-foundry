import { parseCreateTable } from "./parseCreateTable";

export function parseSql(sql: string) {
    const words = sql.split(' ').filter((word) => word !== '');
    switch (words[0].toUpperCase()) {
        case ('CREATE'): {
            const wordsCreateTable = words.slice(0, words.indexOf(';'))
            parseCreateTable(wordsCreateTable, sql);

        }
    } 
}
/* example create table syntax
CREATE TABLE staging_calls_raw (
    id BIGSERIAL PRIMARY KEY,
    src_key TEXT NOT NULL,
    row_num INT NOT NULL,
    ts_raw TEXT NOT NULL,
    neighborhood_raw TEXT,
    call_type_raw TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (src_key, row_num)
);
*/