import { expect } from 'chai';
import { parseDbName } from '../../src/store/resetDB';

describe('Reset DB', () => {
  let processEnv;
  beforeEach(() => {
    processEnv = {
      POSTGRES_ADMIN_URL:
        'postgres://postgres:password@localhost:5432/postgres',
      DB_URL: 'postgres://postgres:password@localhost:5432/mf_dev',
      ALLOW_DB_RESET: 'true',
    };
  });

  it('parseDbName should return the pathname of a valid URL', () => {
    const validUrl = 'postgres://postgres:password@localhost:5432/mf_dev';
    const invalidUrl = "kjfkdlsjkfljdksl";
    const pathname = 'mf_dev';

    const parsedPathname = parseDbName(validUrl);

    expect(() => parseDbName(invalidUrl)).to.throw();
    expect(parsedPathname).to.equal(pathname);
  });
});
