declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string);
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }

  export class StatementSync {
    run(
      ...params: Array<string | number | Uint8Array | null>
    ): { changes: number };
    get(
      ...params: Array<string | number | Uint8Array | null>
    ): Record<string, unknown> | undefined;
    all(
      ...params: Array<string | number | Uint8Array | null>
    ): Array<Record<string, unknown>>;
  }
}
