//

import {
  closeSync,
  openSync,
  readSync
} from "fs";


export abstract class PullStream {

  public abstract pull(buffer: Buffer, offset: number, length?: number): number;

  public skip(length: number): number {
    let buffer = Buffer.alloc(length);
    let readLength = this.pull(buffer, 0);
    return readLength;
  }

  // 1 バイト分を読み込んで返します。
  // すでにデータの終端に到達していて読み込むデータが存在しない場合は、-1 を返します。
  public pullByte(): number {
    let buffer = Buffer.alloc(1);
    let readLength = this.pull(buffer, 0);
    if (readLength === 1) {
      let byte = buffer[0];
      return byte;
    } else {
      return -1;
    }
  }

  // 指定されたバイト数分だけデータを読み込み、リトルエンディアンで符号なし整数に変換して返します。
  // バイト数が足りなかった場合はエラーが発生します。
  public pullUIntLE(byteLength: number): number {
    let buffer = Buffer.alloc(byteLength);
    let readLength = this.pull(buffer, 0);
    if (readLength === byteLength) {
      let number = buffer.readUIntLE(0, byteLength);
      return number;
    } else {
      throw new Error("out of range");
    }
  }

  // 指定されたバイト数分だけデータを読み込み、ビッグエンディアンで符号なし整数に変換して返します。
  // バイト数が足りなかった場合はエラーが発生します。
  public pullUIntBE(byteLength: number): number {
    let buffer = Buffer.alloc(byteLength);
    let readLength = this.pull(buffer, 0, byteLength);
    if (readLength === byteLength) {
      let number = buffer.readUIntBE(0, byteLength);
      return number;
    } else {
      throw new Error("out of range");
    }
  }

  public pullMaybeUIntLE<T>(byteLength: number, defaultValue: T): number | T {
    try {
      return this.pullUIntLE(byteLength);
    } catch (error) {
      return defaultValue;
    }
  }

  public pullMaybeUIntBE<T>(byteLength: number, defaultValue: T): number | T {
    try {
      return this.pullUIntBE(byteLength);
    } catch (error) {
      return defaultValue;
    }
  }

  public abstract close(): void;

}


export class FilePullStream extends PullStream {

  public path: string;
  private descriptor: number;

  public constructor(path: string) {
    super();
    this.path = path;
    this.descriptor = openSync(this.path, "r");
  }

  public pull(buffer: Buffer, offset: number, length?: number): number {
    let actualLength = length ?? buffer.length;
    let readLength = readSync(this.descriptor, buffer, offset, actualLength, null);
    return readLength;
  }

  public close(): void {
    closeSync(this.descriptor);
  }

}


export class BufferPullStream extends PullStream {

  public buffer: Buffer;
  public pointer: number = 0;

  public constructor(buffer: Buffer) {
    super();
    this.buffer = buffer;
  }

  public pull(buffer: Buffer, offset: number, length?: number): number {
    let actualLength = length ?? buffer.length;
    let readLength = Math.min(actualLength, this.buffer.length - this.pointer);
    buffer.set(this.buffer.subarray(this.pointer, this.pointer + readLength), offset);
    this.pointer += readLength;
    return readLength;
  }

  public pullByte(): number {
    try {
      let byte = this.buffer.readUIntLE(this.pointer ++, 1);
      return byte;
    } catch (error) {
      return -1;
    }
  }

  public close(): void {
  }

}