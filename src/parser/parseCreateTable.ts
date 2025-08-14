enum wordType {
  Keyword = 'keyword',
  Identifier = 'identifier',
  Other = 'other',
}

type wordObj = { type: wordType; hasComma: boolean; word: string };
const validKeywords = [
  'TEXT',
  'INTEGER',
  'CREATE',
  'TABLE',
  'NOT',
  'NULL',
  'PRIMARY',
  'KEY',
];

export function parseCreateTable(words: string[], sql: string) {
  validateTable(words, sql);

  const wordObjArrays = createWordLists(words, sql);
}

function validateTable(words: string[], sql: string) {
  if (
    words[0].toUpperCase() !== 'CREATE' ||
    words[1].toUpperCase() !== 'TABLE'
  ) {
    throw new SqlError(sql, words[1]);
  }

  if (words[4] !== '(') {
    throw new SqlError(sql, words[4]);
  }
}

function createWordLists(words: string[], sql: string) {
  const wordObjArrays: wordObj[][] = [];
  for (let i = 5; i < words.length; ) {
    let startIndex = i;
    let endIndex = i + 1;

    while (endIndex < words.length) {
      if (words[endIndex].endsWith(',')) {
        break;
      }
      endIndex++;
    }

    const lineWords = words.slice(startIndex, endIndex);

    if (lineWords.length < 2 || lineWords.length > 4) {
      throw new SqlError(sql, words[i]);
    }

    const currentLineWordObjs: wordObj[] = [];
    for (let j = 0; j < lineWords.length; j++) {
      const type: wordType = j === 0 ? wordType.Identifier : wordType.Keyword;
      const hasComma = j === lineWords.length - 1;

      currentLineWordObjs.push({
        type,
        hasComma,
        word: lineWords[i],
      });
    }
    // ['id', 'INTEGER', 'PRIMARY', 'KEY,']
    wordObjArrays.push(currentLineWordObjs);
    i = endIndex + 1;
  }

  return wordObjArrays;
}

class SqlError extends Error {
  constructor(sql: string, word: string) {
    super();
    this.message = `Invalid SQL Query: ${sql}. Problem occured at word: ${word}.`;
  }
}
const database = {
  table: [
    { id: 0, name: 'alice', age: 30 },
    { id: 1, name: 'Bob', age: 33 },
  ],
};
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
