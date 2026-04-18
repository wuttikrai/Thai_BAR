declare module 'papaparse' {
  export interface ParseResult<T> {
    data: T[];
    errors: ParseError[];
    meta: ParseMeta;
  }

  export interface ParseError {
    message: string;
    row: number;
  }

  export interface ParseMeta {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  }

  export interface ParseConfig<T> {
    header?: boolean;
    skipEmptyLines?: boolean | 'greedy';
    dynamicTyping?: boolean;
    transform?: (value: string, field: string | number) => any;
    complete?: (results: ParseResult<T>) => void;
    error?: (error: Error) => void;
  }

  export function parse<T>(file: string, config: ParseConfig<T>): void;
  export function parse<T>(file: string, config: ParseConfig<T>): ParseResult<T>;
}