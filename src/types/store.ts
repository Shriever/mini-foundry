import { spawn } from 'child_process';
import { runSql } from '../store/runSql';

export type spawnFn = typeof spawn;

export type runSqlFn = typeof runSql;

export type runSqlOptions = {
  dbUrl?: string;
  sql?: string;
  file?: string;
  env?: Record<string, string>;
};