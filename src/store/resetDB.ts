import { runSql } from './runSql';
import { spawn } from 'child_process';

async function resetDb() {
  const pgUrl = process.env.POSTGRES_ADMIN_URL!;
  const adminDb = 'postgres';

  if (process.env.ALLOW_DB_RESET !== 'true')
    throw new Error('DB Reset Prohibited.');

  if (parseDbName(pgUrl) !== adminDb || (await queryDbName(pgUrl)) !== adminDb)
    throw new Error('Reset DB only available in dev');

  const sql = `
        DROP DATABASE IF EXISTS mf_dev WITH (FORCE);
        CREATE DATABASE mf_dev;
    `;

  await runSql({ dbUrl: pgUrl, sql });
  console.log('Database has been cleared!');
}

function parseDbName(dbUrl: string) {
  return new URL(dbUrl).pathname;
}

function queryDbName(dbUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let dbName: string;
    const sql = 'SELECT current_database();';
    const args = [dbUrl, '-t', '-A'];
    const child = spawn('psql', args, {
      stdio: ['pipe', 'pipe', 'inherit'],
      shell: false,
    });

    child.stdout.on('data', (data: string) => {
      dbName = data.replace(/[\n]+/g, '');
    });

    child.on('close', (code: number) => {
      if (code === 0) {
        resolve(dbName);
      } else {
        reject(new Error(`psql process failed with code ${code}`));
      }
    });

    child.on('error', err => reject(err));

    child.stdin.write(sql);
    child.stdin.end();
  });
}
