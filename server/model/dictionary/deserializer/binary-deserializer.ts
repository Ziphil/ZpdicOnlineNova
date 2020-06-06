// tslint:disable: no-bitwise

import {
  BocuPullStream,
  BufferPullStream,
  Dictionary,
  FilePullStream,
  Information,
  InformationModel,
  PullStream,
  WordModel
} from "/server/model/dictionary";
import {
  Deserializer
} from "/server/model/dictionary/deserializer/deserializer";
import {
  takeLog
} from "/server/util/misc";


export class BinaryDeserializer extends Deserializer {

  private stream: PullStream;
  private count: number = 0;

  public constructor(path: string, dictionary: Dictionary, cacheSize?: number) {
    super(path, dictionary, cacheSize);
    this.stream = new FilePullStream(path);
  }

  public start(): void {
    try {
      this.parseHeader();
      this.parseDataBlocks();
      this.emit("end");
    } catch (error) {
      this.emit("error", error);
    } finally {
      this.stream.close();
    }
  }

  private parseHeader(): void {
    let buffer = Buffer.alloc(256);
    this.stream.pull(buffer, 0);
    let version = buffer.readUIntLE(0x8C, 2);
    let type = buffer.readUIntLE(0xA5, 1);
    let indexBlockLength = buffer.readUIntLE(0x94, 2);
    let wordSize = buffer.readUIntLE(0xA0, 2);
    let extendedHeaderLength = buffer.readUIntLE(0xB8, 4);
    let skippedLength = extendedHeaderLength + indexBlockLength * 1024 + 768;
    if ((version >> 8) !== 6) {
      throw new Error("unsupported version");
    }
    if ((type & 0x40) !== 0) {
      throw new Error("encrypted");
    }
    this.stream.skip(skippedLength);
  }

  private parseDataBlocks(): void {
    while (true) {
      let rawLength = this.stream.readMaybeUIntLE(2, -1);
      if (rawLength >= 0) {
        let length = (rawLength & 0x7FFF) * 1024;
        let fieldLength = ((rawLength & 0x8000) !== 0) ? 4 : 2;
        if (length > 0) {
          let buffer = Buffer.alloc(length - 2);
          this.stream.pull(buffer, 0);
          let raw = new BocuPullStream(new BufferPullStream(buffer));
          this.parseWords(raw, fieldLength);
        } else {
          this.stream.skip(1022);
        }
      } else {
        break;
      }
    }
    takeLog("binary-deserializer/read-words", `data block read: ${this.count}`);
  }

  private parseWords(raw: BocuPullStream, fieldLength: number): void {
    let previousNameBytes = new Array<number>();
    while (true) {
      let length = raw.readMaybeUIntLE(fieldLength, -1);
      if (length > 0) {
        let omittedNameLength = raw.readUIntLE(1);
        let flag = raw.readUIntLE(1);
        let buffer = Buffer.alloc(length + omittedNameLength);
        buffer.set(previousNameBytes.slice(0, omittedNameLength));
        raw.pull(buffer, omittedNameLength, length);
        let rawWord = new BocuPullStream(new BufferPullStream(buffer));
        previousNameBytes = this.parseWord(rawWord, fieldLength, flag);
      } else {
        break;
      }
    }
  }

  private parseWord(raw: BocuPullStream, fieldLength: number, flag: number): Array<number> {
    let level = flag & 0x0F;
    let memory = ((flag & 0x20) !== 0) ? 1 : 0;
    let modification = ((flag & 0x40) !== 0) ? 1 : 0;
    let nameData = raw.readBocuString();
    let nameBytes = nameData.bytes;
    let decodedName = nameData.string;
    let nameTabIndex = decodedName.indexOf("\t");
    let name = (nameTabIndex >= 0) ? decodedName.substring(nameTabIndex + 1) : decodedName;
    let translation = raw.readBocuString().string;
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

  private parseExtensions(raw: BocuPullStream, fieldLength: number): Array<Information> {
    let informations = new Array<Information>();
    while (true) {
      let flag = raw.readMaybeUIntLE(1, -1);
      let type = flag & 0xF;
      if ((flag & 0x80) === 0) {
        if ((flag & 0x10) === 0) {
          let information = new InformationModel({});
          let text = raw.readBocuString().string;
          if (type === 0x1) {
            information.title = "用例";
          } else if (type === 0x2) {
            information.title = "発音";
          }
          information.text = text;
          informations.push(information);
        } else {
          let length = raw.readMaybeUIntLE(fieldLength, -1);
          raw.skip(length);
        }
      } else {
        break;
      }
    }
    return informations;
  }

}