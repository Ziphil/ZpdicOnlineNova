// tslint:disable: no-bitwise


const ASCII_PREVIOUS = 0x40;
const MIN = 0x21;
const MIDDLE = 0x90;
const MAX_LEAD = 0xFE;
const MAX_TRAIL = 0xFF;
const RESET = 0xFF;
const COUNT = MAX_LEAD - MIN + 1;
const TRAIL_CONTROL_COUNT = 20;
const TRAIL_BYTE_OFFSET = MIN - TRAIL_CONTROL_COUNT;
const TRAIL_COUNT = MAX_TRAIL - MIN + TRAIL_CONTROL_COUNT + 1;
const SINGLE = 64;
const SECOND_LEAD = 43;
const THIRD_LEAD = 3;
const FOURTH_LEAD = 1;
const FIRST_POSITIVE_REACH = SINGLE - 1;
const FIRST_NEGATIVE_REACH = -SINGLE;
const SECOND_POSITIVE_REACH = FIRST_POSITIVE_REACH + SECOND_LEAD * TRAIL_COUNT;
const SECOND_NEGATIVE_REACH = FIRST_NEGATIVE_REACH - SECOND_LEAD * TRAIL_COUNT;
const THIRD_POSITIVE_REACH = SECOND_POSITIVE_REACH + THIRD_LEAD * TRAIL_COUNT * TRAIL_COUNT;
const THIRD_NEGATIVE_REACH = SECOND_NEGATIVE_REACH - THIRD_LEAD * TRAIL_COUNT * TRAIL_COUNT;
const SECOND_POSITIVE_START = MIDDLE + FIRST_POSITIVE_REACH + 1;
const SECOND_NEGATIVE_START = MIDDLE + FIRST_NEGATIVE_REACH;
const THIRD_POSITIVE_START = SECOND_POSITIVE_START + SECOND_LEAD;
const THIRD_NEGATIVE_START = SECOND_NEGATIVE_START - SECOND_LEAD;
const FOURTH_POSITIVE_START = THIRD_POSITIVE_START + THIRD_LEAD;
const FOURTH_NEGATIVE_START = THIRD_NEGATIVE_START - THIRD_LEAD;
const TRAILS = [-1, 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF, -1, -1, 0x10, 0x11, 0x12, 0x13, -1];


export class BocuDecoder {

  public buffer: Buffer;
  public pointer: number = 0;

  public constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  // 指定されたオフセット位置から指定されたバイト数分だけデータを読み込み、符号なし整数に変換して返します。
  // バッファにバイト数が足りなかった場合はエラーが投げられます。
  // オフセット位置に null が指定されると、内部で保持されているオフセット位置を利用して読み込みを行い、その後に読み込んだバイト数分だけ内部のオフセット位置を進めます。
  public readUIntLE(offset: number | null, byteLength: number): number {
    let pointer = offset ?? this.pointer;
    let number = this.buffer.readUIntLE(pointer, byteLength);
    if (offset === null) {
      this.pointer += byteLength;
    }
    return number;
  }

  public readUIntBE(offset: number | null, byteLength: number): number {
    let pointer = offset ?? this.pointer;
    let number = this.buffer.readUIntBE(pointer, byteLength);
    if (offset === null) {
      this.pointer += byteLength;
    }
    return number;
  }

  public readMaybeUIntLE<T>(offset: number | null, byteLength: number, defaultValue: T): number | T {
    try {
      return this.readUIntLE(offset, byteLength);
    } catch (error) {
      return defaultValue;
    }
  }

  public readMaybeUIntBE<T>(offset: number | null, byteLength: number, defaultValue: T): number | T {
    try {
      return this.readUIntBE(offset, byteLength);
    } catch (error) {
      return defaultValue;
    }
  }

  // 指定されたオフセット位置からデータを読み込み、それを BOCU-1 でエンコードされた文字列だと解釈して、デコードした結果を返します。
  // 終端もしくは 0x0 に到達するまでバイトを読み込みます。
  // オフセット位置に null が指定されると、内部で保持されているオフセット位置を利用して読み込みを行い、その後に読み込んだバイト数分だけ内部のオフセット位置を進めます。
  public readBocuString(offset: number | null): {bytes: Array<number>, string: string} {
    let bytes = new Array<number>();
    let string = "";
    let previous = ASCII_PREVIOUS;
    let current = 0;
    let pointer = offset ?? this.pointer;
    while ((current = this.readMaybeUIntLE(pointer ++, 1, -1)) > 0) {
      bytes.push(current);
      let codePoint = -1;
      let count = 0;
      if (current <= 0x20) {
        if (current !== 0x20) {
          previous = ASCII_PREVIOUS;
        }
        string += String.fromCodePoint(current);
        continue;
      }
      if (current >= SECOND_NEGATIVE_START && current < SECOND_POSITIVE_START) {
        codePoint = previous + current - MIDDLE;
        previous = BocuDecoder.nextPrevious(codePoint);
      } else if (current === RESET) {
        previous = ASCII_PREVIOUS;
        continue;
      } else {
        if (current >= SECOND_NEGATIVE_START) {
          if (current < THIRD_POSITIVE_START) {
            codePoint = (current - SECOND_POSITIVE_START) * TRAIL_COUNT + FIRST_POSITIVE_REACH + 1;
            count = 1;
          } else if (current < FOURTH_POSITIVE_START) {
            codePoint = (current - THIRD_POSITIVE_START) * TRAIL_COUNT * TRAIL_COUNT + SECOND_POSITIVE_REACH + 1;
            count = 2;
          } else {
            codePoint = THIRD_POSITIVE_REACH + 1;
            count = 3;
          }
        } else {
          if (current >= THIRD_NEGATIVE_START) {
            codePoint = (current - SECOND_NEGATIVE_START) * TRAIL_COUNT + FIRST_NEGATIVE_REACH;
            count = 1;
          } else if (current > MIN) {
            codePoint = (current - THIRD_NEGATIVE_START) * TRAIL_COUNT * TRAIL_COUNT + SECOND_NEGATIVE_REACH;
            count = 2;
          } else {
            codePoint = -TRAIL_COUNT * TRAIL_COUNT * TRAIL_COUNT + THIRD_NEGATIVE_REACH;
            count = 3;
          }
        }
        while (count > 0 && (current = this.readMaybeUIntLE(pointer ++, 1, -1)) >= 0) {
          bytes.push(current);
          let trail = 0;
          if (current <= 0x20) {
            trail = TRAILS[current];
            if (trail < 0) {
              throw new Error(`malformed BOCU-1, weird trail: ${trail}, current: ${current}`);
            }
          } else {
            trail = current - TRAIL_BYTE_OFFSET;
          }
          if (count === 1) {
            codePoint = previous + codePoint + trail;
            if (codePoint >= 0x0 && codePoint <= 0x10FFFF) {
              previous = BocuDecoder.nextPrevious(codePoint);
              count = 0;
              break;
            } else {
              throw new Error(`malformed BOCU-1, weird code point: ${codePoint}`);
            }
          } else if (count === 2) {
            codePoint += trail * TRAIL_COUNT;
          } else {
            codePoint += trail * TRAIL_COUNT * TRAIL_COUNT;
          }
          count --;
        }
        if (count !== 0) {
          throw new Error("malformed BOCU-1");
        }
      }
      if (codePoint >= 0x0 && codePoint <= 0x10FFFF) {
        string += String.fromCodePoint(codePoint);
      }
    }
    if (offset === null) {
      this.pointer = pointer;
    }
    return {bytes, string};
  }

  private static nextPrevious(codePoint: number): number {
    if (codePoint >= 0x3040 && codePoint <= 0x309F) {
      return 0x3070;
    } else if (codePoint >= 0x4E00 && codePoint <= 0x9FA5) {
      return 0x4E00 - SECOND_NEGATIVE_REACH;
    } else if (codePoint >= 0xAC00 && codePoint <= 0xD7A3) {
      return 0xC1D1;
    } else {
      return (codePoint & ~0x7F) + ASCII_PREVIOUS;
    }
  }

}