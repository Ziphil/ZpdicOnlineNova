//

import {EventEmitter} from "events";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {SlimeSerializer} from "/server/model/dictionary/serializer/slime-serializer";


export abstract class Serializer extends EventEmitter {

  public path: string;
  public dictionary: Dictionary;
  private error: Error | null = null;

  public constructor(path: string, dictionary: Dictionary) {
    super();
    this.path = path;
    this.dictionary = dictionary;
  }

  public on<E extends keyof SerializerEvent>(event: E, listener: (...args: SerializerEvent[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    const result = super.on(event, listener);
    return result;
  }

  public emit<E extends keyof SerializerEvent>(event: E, ...args: SerializerEvent[E]): boolean;
  public emit(event: string | symbol, ...args: any): boolean {
    if (event === "error") {
      this.error = args[0];
    }
    if (event !== "end" || (event === "end" && this.error === null)) {
      const result = super.emit(event, ...args);
      return result;
    } else {
      return this.listeners(event).length > 0;
    }
  }

  public abstract start(): void;

  /** 与えられたパスの拡張子を調べ、対応するシリアライザを返します。
   * 拡張子が対応していないものだった場合は null を返します。*/
  public static create(path: string, dictionary: Dictionary): Serializer | null {
    try {
      const extension = path.split(/\.(?=[^.]+$)/)[1];
      if (extension === "json") {
        return new SlimeSerializer(path, dictionary);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

}


export type SerializerEvent = {
  end: [],
  error: [Error]
};