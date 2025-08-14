import EventEmitter from 'events';

enum spawnEnum {
  'pipe',
  'inherit',
}

interface spawnOptions {
  stdio?: spawnEnum[];
  shell?: boolean;
}

export function mockSpawn(
  command: string,
  args?: readonly string[],
  options?: spawnOptions
) {
  const emitter = new EventEmitter();
  return {
    stdin: {
      write: (chunk: any) => {
        emitter.emit('data', 'mf_dev');
      },
      end: () => {
        emitter.emit('close', 0);
      },
    },
    stdout: {
      on: (event: string, listener: (data: any) => void) => {
        emitter.on(event, listener);
      },
      setEncoding: (encoding: string) => {},
    },
    on: (event: string, listener: (data: any) => void) => {
      emitter.on(event, listener);
    },
  };
}
