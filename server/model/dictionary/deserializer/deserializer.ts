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

  public constructor(path: string) {
    super();
    this.path = path;
  }

  public on<E extends keyof DeserializerEvent>(event: E, listener: (...args: DeserializerEvent[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    super.on(event, listener);
    return this;
  }

  public abstract start(): void;

  // 与えられたパスの拡張子を調べ、対応するデシリアライザを返します。
  // 拡張子が対応していないものだった場合は null を返します。
  public static create(path: string, originalPath: string): Deserializer | null {
    let extension = originalPath.split(/\.(?=[^.]+$)/)[1];
    if (extension === "json") {
      return new SlimeDeserializer(path);
    } else {
      return null;
    }
  }

}


export type DeserializerEvent = {
  word: [Word],
  other: [string, any],
  end: [],
  error: [Error]
};