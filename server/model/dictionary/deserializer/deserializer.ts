//

import {
  EventEmitter
} from "events";
import {
  BinaryDeserializer,
  Dictionary,
  SlimeDeserializer,
  Word
} from "/server/model/dictionary";


export abstract class Deserializer extends EventEmitter {

  public path: string;
  public dictionary: Dictionary;
  private cacheSize: number;
  private words: Array<Word> = [];
  private error: Error | null = null;

  public constructor(path: string, dictionary: Dictionary, cacheSize?: number) {
    super();
    this.path = path;
    this.dictionary = dictionary;
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

  // 指定されたイベントを発火します。
  // このメソッドは、このクラスを継承したサブクラスの内部で呼ばれることが想定されており、外部から呼ばれることは想定されていません。
  // このメソッドによって word イベントが発火されると、引数の単語データがキャッシュされ、一定数の単語データがキャッシュされると自動的に words イベントを発火します。
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
      if (event === "error") {
        this.error = args[0];
      }
    }
    if (event !== "end" || (event === "end" && this.error === null)) {
      let result = super.emit(event, ...args);
      return result;
    } else {
      return this.listeners(event).length > 0;
    }
  }

  public abstract start(): void;

  // 与えられたパスの拡張子を調べ、対応するデシリアライザを返します。
  // 拡張子が対応していないものだった場合は null を返します。
  public static create(path: string, originalPath: string, dictionary: Dictionary, cacheSize?: number): Deserializer | null {
    try {
      let extension = originalPath.split(/\.(?=[^.]+$)/)[1];
      if (extension === "json") {
        return new SlimeDeserializer(path, dictionary, cacheSize);
      } else if (extension === "dic") {
        return new BinaryDeserializer(path, dictionary, cacheSize);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

}


export type DeserializerEvent = {
  word: [Word],
  words: [Array<Word>],
  property: [Partial<DictionaryProperty>],
  external: [string, any],
  end: [],
  error: [Error]
};
export type DictionaryProperty = {
  explanation: string,
  snoj: string
};