import fs from 'fs';
import path from 'path';

const fileName = 'database.json';
const filePath = path.join(__dirname, fileName);

fs.access(filePath, fs.constants.F_OK, err => {
  if (err) {
    console.log(fileName, 'does not exists.');
    fs.writeFile(filePath, '{}', {}, err2 => {
      if (err2) throw err2;
      console.log('Created', fileName);
    });
  } else {
    throw new Error('database.json already exists.');
  }
});

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
