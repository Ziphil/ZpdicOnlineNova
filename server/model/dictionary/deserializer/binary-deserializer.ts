// tslint:disable: no-bitwise

import {
  closeSync,
  openSync,
  readSync
} from "fs";
import {
  BocuDecoder,
  Dictionary,
  Information,
  InformationModel,
  WordModel
} from "/server/model/dictionary";
import {
  Deserializer
} from "/server/model/dictionary/deserializer/deserializer";
import {
  takeLog
} from "/server/util/misc";


export class BinaryDeserializer extends Deserializer {

  private descriptor: number;
  private position: number = 0;
  private count: number = 0;

  public constructor(path: string, dictionary: Dictionary, cacheSize?: number) {
    super(path, dictionary, cacheSize);
    this.descriptor = openSync(this.path, "r");
  }

  public start(): void {
    try {
      this.parseHeader();
      this.parseDataBlocks();
      this.emit("end");
    } catch (error) {
      this.emit("error", error);
    } finally {
      closeSync(this.descriptor);
    }
  }

  private parseHeader(): void {
    let raw = this.readBuffer(256);
    let version = raw.readUIntLE(0x8C, 2);
    let type = raw.readUIntLE(0xA5, 1);
    let indexBlockSize = raw.readUIntLE(0x94, 2);
    let wordSize = raw.readUIntLE(0xA0, 2);
    let extendedHeaderSize = raw.readUIntLE(0xB8, 4);
    let skippedSize = extendedHeaderSize + indexBlockSize * 1024 + 768;
    if ((version >> 8) !== 6) {
      throw new Error("unsupported version");
    }
    if ((type & 0x40) !== 0) {
      throw new Error("encrypted");
    }
    this.readBuffer(skippedSize);
  }

  private parseDataBlocks(): void {
    while (true) {
      let rawLength = this.readMaybeBuffer(2)?.readUIntLE(0, 2);
      if (rawLength !== undefined) {
        let length = (rawLength & 0x7FFF) * 1024;
        let fieldLength = ((rawLength & 0x8000) !== 0) ? 4 : 2;
        if (length > 0) {
          let raw = this.readBuffer(length - 2);
          this.parseWords(raw, fieldLength);
        } else {
          this.readBuffer(1022);
        }
      } else {
        break;
      }
    }
    takeLog("binary-deserializer/read-words", `data block read: ${this.count}`);
  }

  private parseWords(raw: BocuDecoder, fieldLength: number): void {
    let previousNameBytes = new Array<number>();
    while (true) {
      let length = raw.readMaybeUIntLE(null, fieldLength, -1);
      if (length > 0) {
        let omittedNameLength = raw.readUIntLE(null, 1);
        let flag = raw.readUIntLE(null, 1);
        let buffer = Buffer.alloc(length + omittedNameLength);
        buffer.set(previousNameBytes.slice(0, omittedNameLength));
        buffer.set(raw.buffer.subarray(raw.pointer, raw.pointer + length), omittedNameLength);
        raw.pointer += length;
        let rawWord = new BocuDecoder(buffer);
        previousNameBytes = this.parseWord(rawWord, fieldLength, flag);
      } else {
        break;
      }
    }
  }

  private parseWord(raw: BocuDecoder, fieldLength: number, flag: number): Array<number> {
    let level = flag & 0x0F;
    let memory = ((flag & 0x20) !== 0) ? 1 : 0;
    let modification = ((flag & 0x40) !== 0) ? 1 : 0;
    let nameData = raw.readBocuString(null);
    let nameBytes = nameData.bytes;
    let decodedName = nameData.string;
    let nameTabIndex = decodedName.indexOf("\t");
    let name = (nameTabIndex >= 0) ? decodedName.substring(nameTabIndex + 1) : decodedName;
    let translation = raw.readBocuString(null).string;
    let word = new WordModel({});
    this.count ++;
    word.dictionary = this.dictionary;
    word.number = this.count;
    word.name = name;
    word.equivalents = [];
    word.tags = [];
    word.informations = [];
    word.variations = [];
    word.relations = [];
    let information = new InformationModel({});
    information.title = "訳語";
    information.text = translation;
    word.informations.push(information);
    if ((flag & 0x10) !== 0) {
      let informations = this.parseExtensions(raw, fieldLength);
      word.informations.push(...informations);
    }
    this.emit("word", word);
    return nameBytes;
  }

  private parseExtensions(raw: BocuDecoder, fieldLength: number): Array<Information> {
    let informations = new Array<Information>();
    while (true) {
      let flag = raw.readMaybeUIntLE(null, 1, -1);
      let type = flag & 0xF;
      if ((flag & 0x80) === 0) {
        if ((flag & 0x10) === 0) {
          let information = new InformationModel({});
          let text = raw.readBocuString(null).string;
          if (type === 0x1) {
            information.title = "用例";
          } else if (type === 0x2) {
            information.title = "発音";
          }
          information.text = text;
          informations.push(information);
        } else {
          let length = raw.readMaybeUIntLE(null, fieldLength, -1);
          raw.pointer += length;
        }
      } else {
        break;
      }
    }
    return informations;
  }

  private readBuffer(size: number): BocuDecoder {
    let buffer = Buffer.alloc(size);
    let readSize = readSync(this.descriptor, buffer, 0, size, this.position);
    if (readSize === size) {
      this.position += readSize;
      let decoder = new BocuDecoder(buffer);
      return decoder;
    } else {
      throw new Error("read failed");
    }
  }

  private readMaybeBuffer(size: number): BocuDecoder | null {
    try {
      return this.readBuffer(size);
    } catch (error) {
      return null;
    }
  }

}