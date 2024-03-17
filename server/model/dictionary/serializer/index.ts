//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Serializer} from "/server/model/dictionary/serializer/serializer";
import {SlimeSerializer} from "/server/model/dictionary/serializer/slime-serializer";
export * from "/server/model/dictionary/serializer/serializer";
export * from "/server/model/dictionary/serializer/slime-serializer";


/** 与えられたパスの拡張子を調べ、対応するシリアライザを返します。
  * 拡張子が対応していないものだった場合は `null` を返します。*/
export function createSerializer(path: string, dictionary: Dictionary): Serializer | null {
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