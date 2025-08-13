import { spawnFn, runSqlFn } from '../types/store';

const SQL_RESET = `
        DROP DATABASE IF EXISTS mf_dev WITH (FORCE);
        CREATE DATABASE mf_dev;
    `;

const SQL_CURRENT_DB = 'SELECT current_database();';

export async function resetDb(
  runSql: runSqlFn,
  _spawn: spawnFn,
  processEnv: NodeJS.ProcessEnv = process.env
) {
  const { POSTGRES_ADMIN_URL, ALLOW_DB_RESET } = processEnv;

  if (!POSTGRES_ADMIN_URL) throw new Error('POSTGRES_ADMIN_URL is required.');
  if (!ALLOW_DB_RESET) throw new Error('ALLOW_DB_RESET is required.');

  const pgUrl = POSTGRES_ADMIN_URL;
  const adminDb = 'postgres';

  if (ALLOW_DB_RESET !== 'true') throw new Error('DB Reset Prohibited.');

  if (
    parseDbName(pgUrl) !== adminDb ||
    (await queryDbName(pgUrl, _spawn)) !== adminDb
  )
    throw new Error('Reset DB only available in dev');

  await runSql({ dbUrl: pgUrl, sql: SQL_RESET });
  console.log('Database has been cleared!');
}

export function parseDbName(dbUrl: string) {
  try {
    return new URL(dbUrl).pathname.slice(1);
  } catch (err) {
    throw new Error(`Invalid database URL: ${dbUrl}`);
  }
}

export function queryDbName(dbUrl: string, _spawn: spawnFn): Promise<string> {
  return new Promise((resolve, reject) => {
    let dbName: string = '';
    const args = [dbUrl, '-t', '-A'];
    const child = _spawn('psql', args, {
      stdio: ['pipe', 'pipe', 'inherit'],
      shell: false,
    });

    child.stdout.setEncoding('utf-8');

    child.stdout.on('data', (data: string) => {
      dbName = data.replace(/[\n]+/g, '');
    });

    child.on('close', (code: number) => {
      if (code === 0 && dbName !== '') {
        resolve(dbName);
      } else {
        reject(
          new Error(
            `psql process failed with code ${code} for dbUrl: ${dbUrl}. Could not get database name.`
          )
        );
      }
    });

    child.on('error', err => reject(err));

    child.stdin.write(SQL_CURRENT_DB);
    child.stdin.end();
  });
}

(async () => {
  await resetDb(require('./runSql').runSql, require('child_process').spawn);
})();
