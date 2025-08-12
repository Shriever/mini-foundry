// Normally implemented with the 'pg' library
import { spawn } from 'child_process';

type Options = {
  dbUrl?: string;
  sql?: string;
  file?: string;
  env?: Record<string, string>;
};

export function runSql(opts: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [];
    if (opts.dbUrl) args.push(opts.dbUrl);

    args.push('-v', 'ON_ERROR_STOP=1');

    if (opts.file) {
      args.push('-f', opts.file);
    } else {
      args.push('-f', '-');
    }

    const child = spawn('psql', args, {
      stdio: ['pipe', 'inherit', 'inherit'], // what are these strings?
      env: { ...process.env, ...(opts.env || {}) }, // can I implement .env without introducing security concerns?
      shell: false,
    });

    if (!opts.file && opts.sql) {
      child.stdin.write(opts.sql);
      child.stdin.end();
    }

    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`psql exited with code ${code}`));
    });
  });
}
