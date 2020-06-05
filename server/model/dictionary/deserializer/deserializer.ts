//

import {
  EventEmitter
} from "events";
import {
  SlimeDeserializer,
  Word
} from "/server/model/dictionary";


export abstract class Deserializer extends EventEmitter {

  public path: string;
  private cacheSize: number;
  private words: Array<Word> = [];

  public constructor(path: string, cacheSize?: number) {
    super();
    this.path = path;
    this.cacheSize = cacheSize ?? 500;
  }

  public on<E extends keyof DeserializerEvent>(event: E, listener: (...args: DeserializerEvent[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    let result = super.on(event, listener);
    return result;
  }

  public once<E extends keyof DeserializerEvent>(event: E, listener: (...args: DeserializerEvent[E]) => void): this;
  public once(event: string | symbol, listener: (...args: any) => void): this {
    let result = super.once(event, listener);
    return result;
  }

  public emit<E extends keyof DeserializerEvent>(event: E, ...args: DeserializerEvent[E]): boolean;
  public emit(event: string | symbol, ...args: any): boolean {
    if (event === "word") {
      this.words.push(args[0]);
      if (this.words.length >= this.cacheSize) {
        super.emit("words", this.words);
        this.words = [];
      }
    } else if (event === "end" || event === "error") {
      super.emit("words", this.words);
      this.words = [];
    }
    let result = super.emit(event, ...args);
    return result;
  }

  public abstract start(): void;

  // 与えられたパスの拡張子を調べ、対応するデシリアライザを返します。
  // 拡張子が対応していないものだった場合は null を返します。
  public static create(path: string, originalPath: string, cacheSize?: number): Deserializer | null {
    let extension = originalPath.split(/\.(?=[^.]+$)/)[1];
    if (extension === "json") {
      return new SlimeDeserializer(path, cacheSize);
    } else {
      return null;
    }
  }

}


export type DeserializerEvent = {
  word: [Word],
  words: [Array<Word>],
  other: [string, any],
  end: [],
  error: [Error]
};