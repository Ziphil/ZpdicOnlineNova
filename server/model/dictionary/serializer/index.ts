//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Serializer} from "/server/model/dictionary/serializer/serializer";
import {SlimeSerializer} from "/server/model/dictionary/serializer/slime-serializer";
import {ZpdicSerializer} from "/server/model/dictionary/serializer/zpdic-serializer";
export * from "/server/model/dictionary/serializer/serializer";
export * from "/server/model/dictionary/serializer/slime-serializer";


/** 与えられたパスの拡張子を調べ、対応するシリアライザを返します。
  * 拡張子が対応していないものだった場合は、エラーを発生させます。*/
export function createSerializer(path: string, dictionary: Dictionary): Serializer {
  try {
    const extension = path.split(/\.(?=[^.]+$)/)[1];
    if (extension === "json") {
      return new SlimeSerializer(path, dictionary);
    } else if (extension === "zpdc") {
      return new ZpdicSerializer(path, dictionary);
    } else {
      throw new Error("unsupported file type");
    }
  } catch (error) {
    throw new Error("failed to create serializer");
  }
}