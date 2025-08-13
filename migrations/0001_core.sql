IF NOT EXISTS CREATE DATABASE mf_dev;

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

CREATE TABLE staging_weather_raw (
    id BIGSERIAL PRIMARY KEY,
    src_key TEXT NOT NULL,
    hour_raw TEXT NOT NULL,
    precip_raw TEXT,
    temp_c_raw TEXT,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (src_key, hour_raw)
);

CREATE TABLE catalog_sources (
    name TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('csv', 'api', 'stream')),
    config_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE catalog_jobs (
    name TEXT PRIMARY KEY,
    code_hash TEXT NOT NULL,
    params_schema JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE catalog_runs (
    run_id UUID PRIMARY KEY,
    job_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED')),
    input_refs JSONB NOT NULL, -- e.g., ["sfo_911_csv:2023-06-01"]
    output_refs JSONB NOT NULL, -- e.g., ["warehouse.calls_clean:2023-06-01"]
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE catalog_lineage (
    from_ref TEXT NOT NULL,
    to_ref TEXT NOT NULL,
    job_name TEXT NOT NULL,
    run_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);