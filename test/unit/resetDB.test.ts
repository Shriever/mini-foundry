import { expect } from 'chai';
import { parseDbName, queryDbName } from '../../src/store/resetDB';
import { mockSpawn } from '../mock/spawn.mock';
import { spawnFn } from '../../src/types/store';

describe('Reset DB', () => {
  let processEnv: any;
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
    const validUrlExt =
      'postgres://postgres:password@localhost:5432/mf_dev?test=true';
    const pathname = 'mf_dev';

    const invalidUrl = 'kjfkdlsjkfljdksl';

    const parsedPathname = parseDbName(validUrl);

    expect(() => parseDbName(invalidUrl)).to.throw();
    expect(parseDbName(validUrl)).to.equal(pathname);
    expect(parseDbName(validUrlExt)).to.equal(pathname);
  });

  it('queryDbName should get the db name', async () => {
    const dbName = await queryDbName(processEnv.DB_URL, mockSpawn as spawnFn);

    expect(dbName).to.equal('mf_dev');
  })
});
