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

const database = {
  table: [
    { id: 0, name: 'alice', age: 30 },
    { id: 1, name: 'Bob', age: 33 },
  ],
};
