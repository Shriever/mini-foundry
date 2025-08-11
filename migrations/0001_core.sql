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