import { assert } from 'console';
import { type Option, Some, None } from './option';

type Ok_<T> = { __type: 'Ok'; value: T };
type Err_<E> = { __type: 'Err'; value: E };
type Result_<T, E> = Ok_<T> | Err_<E>;

function Ok_<T, E>(t: T): Result_<T, E> {
  return { __type: 'Ok', value: t };
}

function Err_<T, E>(e: E): Result_<T, E> {
  return { __type: 'Err', value: e };
}

function isOk_<T, E>(r: Result_<T, E>): r is Ok_<T> {
  return r.__type === 'Ok';
}

function isErr_<T, E>(r: Result_<T, E>): r is Err_<E> {
  return r.__type === 'Err';
}

export type Unit = { __type: 'Unit' };
export const unit: Unit = { __type: 'Unit' };

export function assertIsError(e: unknown): asserts e is Error {
  assert(e instanceof Error);
}

class ResultError extends Error {}

export class Result<T, E> {
  data: Result_<T, E>;

  constructor(r: Result_<T, E>) {
    this.data = r;
  }

  isOk(): boolean {
    return isOk_(this.data);
  }

  isErr(): boolean {
    return isErr_(this.data);
  }

  static fromNull<T>(t: T | null | undefined): Result<T, Unit> {
    if (t) return Ok(t);
    return Err(unit);
  }

  static fromException<T>(fn: () => T): Result<T, unknown> {
    try {
      const val: T = fn();
      return Ok(val);
    } catch (err) {
      return Err(err);
    }
  }

  static fromError<T, E>(fn: () => T): Result<T, E> {
    try {
      const val: T = fn();
      return Ok(val);
    } catch (err) {
      return Err(err as E);
    }
  }

  static async fromExceptionAsync<T>(p: Promise<T>): Promise<Result<T, unknown>> {
    try {
      const val = await p;
      return Ok(val);
    } catch (err) {
      return Err(err);
    }
  }

  static async fromErrorAsync<T>(p: Promise<T>): Promise<Result<T, Error>> {
    try {
      const val = await p;
      return Ok(val);
    } catch (err) {
      assertIsError(err);
      return Err(err);
    }
  }

  static async multipleExceptionAsync<T>(promises: Promise<T>[]): Promise<Result<T[], unknown>> {
    try {
      const result = await Promise.all(promises)
      return Ok(result)
    } catch (err) {
      return Err(err);
    }
  }

  static async multipleErrorAsync<T>(promises: Promise<T>[]): Promise<Result<T[], Error>> {
    try {
      const result = await Promise.all(promises)
      return Ok(result)
    } catch (err) {
      assertIsError(err);
      return Err(err);
    }
  }

  unwrap(): T {
    if (isOk_(this.data)) return this.data.value;
    throw new ResultError('Tried unwrapping result to Ok, but had type Err');
  }

  unwrapOrDefault(default_: T): T {
    if (isOk_(this.data)) return this.data.value;
    return default_;
  }

  unwrapOrElse(fn: () => T): T {
    if (isOk_(this.data)) return this.data.value;
    return fn();
  }

  expect(errMsg: string): T {
    if (isOk_(this.data)) return this.data.value;
    throw new ResultError(errMsg);
  }

  toOption(): Option<T> {
    if (isOk_(this.data)) return Some(this.data.value);
    return None();
  }

  toString(): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (isOk_(this.data)) return `Ok(${this.data.value})`;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Err(${this.data.value})`;
  }

  log(): void {
    console.log(this.toString());
  }

  logWith(logger: (s: string) => void): void {
    logger(this.toString());
  }

  ////////////////advanced functions////////////////////////////

  match<R>(okCase: (t: T) => R, errCase: (e: E) => R): R {
    if (isOk_(this.data)) return okCase(this.data.value);
    return errCase(this.data.value);
  }

  matchEffect(okCase: (t: T) => void, errCase: (e: E) => void): void {
    if (isOk_(this.data)) okCase(this.data.value);
    else errCase(this.data.value);
  }

  map<U>(fn: (t: T) => U): Result<U, E> {
    if (isOk_(this.data)) return Ok(fn(this.data.value));
    return Err(this.data.value);
  }

  flatMap<U>(fn: (t: T) => Result<U, E>): Result<U, E> {
    if (isOk_(this.data)) return fn(this.data.value);
    return Err(this.data.value);
  }

  mapOr<U>(fn: (t: T) => U, default_: U): Result<U, E> {
    if (isOk_(this.data)) return Ok(fn(this.data.value));
    return Ok(default_);
  }

  mapOrElse<U>(fn: (t: T) => U, fallback: (e: E) => U): Result<U, E> {
    if (isOk_(this.data)) return Ok(fn(this.data.value));
    return Ok(fallback(this.data.value));
  }

  or(r: Result<T, E>): Result<T, E> {
    if (this.isOk()) return this;
    else if (r.isOk()) return r;
    else return r;
  }

  and(r: Result<T, E>): Result<T, E> {
    if (this.isErr()) return this;
    else if (r.isErr()) return r;
    else return r;
  }

  ////////////////err functions////////////////////////////

  unwrapErr(): E {
    if (isErr_(this.data)) return this.data.value;
    throw new ResultError('Tried unwrapping result to type Err, but had type Ok');
  }

  expectErr(errMsg: string): E {
    if (isErr_(this.data)) return this.data.value;
    throw new ResultError(errMsg);
  }

  mapErr<J>(fn: (e: E) => J): Result<T, J> {
    if (isErr_(this.data)) return Err(fn(this.data.value));
    return Ok(this.data.value);
  }

  throwIfErr(): T {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (isErr_(this.data)) throw new Error(`${this.data.value}`);
    return this.data.value;
  }

  coerceErrType<J>(): Result<T, J> {
    if (isOk_(this.data)) return Ok(this.data.value);
    return Err(this.data.value as unknown as J);
  }
}

export function Ok<T, E>(t: T): Result<T, E> {
  return new Result(Ok_(t));
}

export function Err<T, E>(e: E): Result<T, E> {
  return new Result(Err_(e));
}
