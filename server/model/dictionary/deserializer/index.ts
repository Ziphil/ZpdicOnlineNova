//

import fs from "fs";
import {BinaryDeserializer} from "/server/model/dictionary/deserializer/binary-deserializer";
import {Deserializer} from "/server/model/dictionary/deserializer/deserializer";
import {SlimeDeserializer} from "/server/model/dictionary/deserializer/slime-deserializer";
import {Dictionary} from "/server/model/dictionary/dictionary";
export * from "/server/model/dictionary/deserializer/deserializer";
export * from "/server/model/dictionary/deserializer/binary-deserializer";
export * from "/server/model/dictionary/deserializer/slime-deserializer";


/** 与えられたパスの拡張子を調べ、対応するデシリアライザを返します。
  * 拡張子が対応していないものだったり、デシリアライザの生成に失敗した場合は、`null` を返します。*/
export function createDeserializer(path: string, originalPath: string, dictionary: Dictionary, cacheSize?: number): Deserializer | null {
  try {
    const extension = originalPath.split(/\.(?=[^.]+$)/)[1];
    if (fs.existsSync(path)) {
      if (extension === "json") {
        return new SlimeDeserializer(path, dictionary, cacheSize);
      } else if (extension === "dic") {
        return new BinaryDeserializer(path, dictionary, cacheSize);
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}