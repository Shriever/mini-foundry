import { expect } from 'chai';

describe('Reset DB', () => {
  beforeEach(() => {
    process.env.POSTGRES_ADMIN_URL =
      'postgres://postgres:password@localhost:5432/postgres';
    process.env.DB_URL = 'postgres://postgres:password@localhost:5432/mf_dev';
    process.env.ALLOW_DB_RESET = 'true';
  });

});
