//

import {
  closeSync,
  openSync,
  readSync
} from "fs";


export abstract class PullStream {

  // データを読み込んで、buffer に渡されたバッファに対して offset に指定された位置から書き込みます。
  // このとき、length に指定されたバイト数分だけデータを読み込みます。
  // length を省略した場合は、buffer の長さと同じ値が指定されたものと見なされます。
  // ここで指定されたバイト数分のデータが残っていない場合は、エラーは発生させずに、単にデータを最後まで読み込みます。
  // 実際に読み込まれたバイト数を返します。
  public abstract pull(buffer: Buffer, offset: number, length?: number): number;

  public skip(length: number): number {
    let buffer = Buffer.alloc(length);
    let readLength = this.pull(buffer, 0);
    return readLength;
  }

  // 1 バイト分を読み込んで返します。
  // すでにデータの終端に到達していて読み込むデータが存在しない場合は、-1 を返します。
  public read(): number {
    let buffer = Buffer.alloc(1);
    let readLength = this.pull(buffer, 0);
    if (readLength === 1) {
      let byte = buffer[0];
      return byte;
    } else {
      return -1;
    }
  }

  public readBuffer(length: number): Buffer {
    let buffer = Buffer.alloc(length);
    let readLength = this.pull(buffer, 0, length);
    if (readLength === length) {
      return buffer;
    } else {
      throw new Error("out of range");
    }
  }

  // 指定されたバイト数分だけデータを読み込み、リトルエンディアンで符号なし整数に変換して返します。
  // バイト数が足りなかった場合はエラーが発生します。
  public readUIntLE(length: number): number {
    let buffer = Buffer.alloc(length);
    let readLength = this.pull(buffer, 0);
    if (readLength === length) {
      let number = buffer.readUIntLE(0, length);
      return number;
    } else {
      throw new Error("out of range");
    }
  }

  // 指定されたバイト数分だけデータを読み込み、ビッグエンディアンで符号なし整数に変換して返します。
  // バイト数が足りなかった場合はエラーが発生します。
  public readUIntBE(length: number): number {
    let buffer = Buffer.alloc(length);
    let readLength = this.pull(buffer, 0, length);
    if (readLength === length) {
      let number = buffer.readUIntBE(0, length);
      return number;
    } else {
      throw new Error("out of range");
    }
  }

  public readMaybeUIntLE<T>(length: number, defaultValue: T): number | T {
    try {
      return this.readUIntLE(length);
    } catch (error) {
      return defaultValue;
    }
  }

  public readMaybeUIntBE<T>(length: number, defaultValue: T): number | T {
    try {
      return this.readUIntBE(length);
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

  public skip(length: number): number {
    let readLength = Math.min(length, this.buffer.length - this.pointer);
    this.pointer += readLength;
    return readLength;
  }

  public read(): number {
    try {
      let byte = this.buffer.readUIntLE(this.pointer, 1);
      this.pointer ++;
      return byte;
    } catch (error) {
      return -1;
    }
  }

  public close(): void {
  }

}