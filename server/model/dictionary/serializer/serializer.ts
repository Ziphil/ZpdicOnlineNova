//

import {
  EventEmitter
} from "events";
import {
  Dictionary,
  SlimeSerializer
} from "/server/model/dictionary";


export abstract class Serializer extends EventEmitter {

  public path: string;
  public dictionary: Dictionary;

  public constructor(path: string, dictionary: Dictionary) {
    super();
    this.path = path;
    this.dictionary = dictionary;
  }

  public on<E extends keyof SerializerEvent>(event: E, listener: (...args: SerializerEvent[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    let result = super.on(event, listener);
    return result;
  }

  public abstract start(): void;

  // 与えられたパスの拡張子を調べ、対応するシリアライザを返します。
  // 拡張子が対応していないものだった場合は null を返します。
  public static create(path: string, dictionary: Dictionary): Serializer | null {
    try {
      let extension = path.split(/\.(?=[^.]+$)/)[1];
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