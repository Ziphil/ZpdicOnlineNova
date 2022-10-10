/* eslint-disable no-bitwise */

import {
  Dictionary,
  Equivalent,
  Information,
  InformationModel,
  Relation,
  Variation,
  Word,
  WordModel
} from "/server/model/dictionary";
import {
  Deserializer
} from "/server/model/dictionary/deserializer/deserializer";
import {
  LogUtil
} from "/server/util/log";
import {
  BocuPullStream
} from "/server/util/stream/bocu-pull-stream";
import {
  BufferPullStream,
  FilePullStream,
  PullStream
} from "/server/util/stream/pull-stream";


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
    const buffer = this.stream.readBuffer(256);
    const version = buffer.readUIntLE(0x8C, 2);
    const type = buffer.readUIntLE(0xA5, 1);
    const wordSize = buffer.readUIntLE(0xA0, 2);
    const indexBlockLength = buffer.readUIntLE(0x94, 2);
    const extendedHeaderLength = buffer.readUIntLE(0xB8, 4);
    const skippedLength = extendedHeaderLength + indexBlockLength * 1024 + 768;
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
      const rawLength = this.stream.readMaybeUIntLE(2, -1);
      if (rawLength >= 0) {
        const length = (rawLength & 0x7FFF) * 1024;
        const fieldLength = ((rawLength & 0x8000) !== 0) ? 4 : 2;
        if (length > 0) {
          this.parseWords(length, fieldLength);
        } else {
          this.stream.skip(1022);
        }
      } else {
        break;
      }
    }
    LogUtil.log("model/binaryDeserializer/parseDataBlocks", {readCount: this.count});
  }

  private parseWords(length: number, fieldLength: number): void {
    const buffer = this.stream.readBuffer(length - 2);
    const raw = new BocuPullStream(new BufferPullStream(buffer));
    let previousNameBytes = new Array<number>();
    while (true) {
      const length = raw.readMaybeUIntLE(fieldLength, -1);
      if (length > 0) {
        const omittedNameLength = raw.readUIntLE(1);
        const flag = raw.readUIntLE(1);
        const buffer = Buffer.alloc(length + omittedNameLength);
        const rawWord = new BocuPullStream(new BufferPullStream(buffer));
        buffer.set(previousNameBytes.slice(0, omittedNameLength));
        raw.pull(buffer, omittedNameLength, length);
        const [word, nameBytes] = this.createWord(rawWord, fieldLength, flag);
        previousNameBytes = nameBytes;
        this.emit("word", word);
      } else {
        break;
      }
    }
  }

  private createWord(raw: BocuPullStream, fieldLength: number, flag: number): [Word, Array<number>] {
    const [rawName, nameBytes] = raw.readBocuString(true);
    const nameTabIndex = rawName.indexOf("\t");
    const name = (nameTabIndex >= 0) ? rawName.substring(nameTabIndex + 1) : rawName;
    this.count ++;
    const dictionary = this.dictionary;
    const number = this.count;
    const equivalents = new Array<Equivalent>();
    const tags = new Array<string>();
    const informations = new Array<Information>();
    const variations = new Array<Variation>();
    const relations = new Array<Relation>();
    informations.push(this.createInformation(raw));
    if ((flag & 0x10) !== 0) {
      const informations = this.createAdditionalInformations(raw, fieldLength);
      informations.push(...informations);
    }
    const updatedDate = new Date();
    const word = new WordModel({dictionary, number, name, equivalents, tags, informations, variations, relations, updatedDate});
    return [word, nameBytes];
  }

  private createInformation(raw: BocuPullStream): Information {
    const title = "訳語";
    const text = raw.readBocuString();
    const information = new InformationModel({title, text});
    return information;
  }

  private createAdditionalInformations(raw: BocuPullStream, fieldLength: number): Array<Information> {
    const informations = new Array<Information>();
    while (true) {
      const flag = raw.readMaybeUIntLE(1, -1);
      const type = flag & 0xF;
      if ((flag & 0x80) === 0) {
        if ((flag & 0x10) === 0) {
          const title = (type === 0x2) ? "発音" : "用例";
          const text = raw.readBocuString();
          const information = new InformationModel({title, text});
          informations.push(information);
        } else {
          const length = raw.readMaybeUIntLE(fieldLength, -1);
          raw.skip(length);
        }
      } else {
        break;
      }
    }
    return informations;
  }

}