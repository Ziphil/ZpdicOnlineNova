//

import {
  createReadStream
} from "fs";
import {
  Readable
} from "stream";
import {
  parser
} from "stream-json";
import {
  Stack,
  Token
} from "stream-json/filters/FilterBase";
import {
  pick
} from "stream-json/filters/Pick";
import {
  streamValues
} from "stream-json/streamers/StreamValues";
import {
  SlimeEquivalentModel,
  SlimeInformationModel,
  SlimeRelationModel,
  SlimeVariationModel,
  SlimeWordDocument,
  SlimeWordModel
} from "../slime";


export class SlimeStream {

  public path: string;
  public encoding: string;
  private wordPipeline: Readable;

  public constructor(path: string, encoding: string = "utf8") {
    this.path = path;
    this.encoding = encoding;
    this.wordPipeline = this.createWordPipeline(path, encoding);
  }

  private createWordPipeline(path: string, encoding: string): Readable {
    let filter = function (stack: Stack, token: Token): boolean {
      return stack[0] === "words" && typeof stack[1] === "number";
    };
    let stream = createReadStream(path, {encoding});
    let pipeline = stream.pipe(parser()).pipe(pick({filter})).pipe(streamValues());
    return pipeline;
  }

  public on<E extends keyof SlimeStreamType>(event: E, listener: (...args: SlimeStreamType[E]) => void): void {
    if (event === "word") {
      let castListener = SlimeStream.cast<"word">(listener);
      this.wordPipeline.on("data", (chunk) => {
        let word = this.createWord(chunk.value);
        castListener(word);
      });
    } else if (event === "wordEnd") {
      let castListener = SlimeStream.cast<"wordEnd">(listener);
      this.wordPipeline.on("end", castListener);
    } else if (event === "error") {
      let castListener = SlimeStream.cast<"error">(listener);
      this.wordPipeline.on("error", castListener);
    }
  }

  private createWord(raw: any): SlimeWordDocument {
    let word = new SlimeWordModel({});
    word.number = parseInt(raw["entry"]["id"], 10);
    word.name = raw["entry"]["form"];
    word.equivalents = [];
    for (let rawEquivalent of raw["translations"]) {
      let equivalent = new SlimeEquivalentModel({});
      equivalent.title = rawEquivalent["title"];
      equivalent.names = rawEquivalent["forms"];
      word.equivalents.push(equivalent);
    }
    word.tags = raw["tags"];
    word.informations = [];
    for (let rawInformation of raw["contents"]) {
      let information = new SlimeInformationModel({});
      information.title = rawInformation["title"];
      information.text = rawInformation["text"];
      word.informations.push(information);
    }
    word.variations = [];
    for (let rawVariation of raw["variations"]) {
      let variation = new SlimeVariationModel({});
      variation.title = rawVariation["title"];
      variation.name = rawVariation["form"];
      word.variations.push(variation);
    }
    word.relations = [];
    for (let rawRelation of raw["relations"]) {
      let relation = new SlimeRelationModel({});
      relation.title = rawRelation["title"];
      relation.number = parseInt(rawRelation["entry"]["id"], 10);
      relation.name = rawRelation["entry"]["form"];
      word.relations.push(relation);
    }
    return word;
  }

  // イベントリスナーの型をダウンキャストするユーティリティメソッドです。
  // 本来なら、event の値を判定した時点で listner の型もそれに合致したものであると推論されるべきですが、推論されないようなのでこのメソッドを使います。
  // もっと良い方法ないの?
  private static cast<K extends keyof SlimeStreamType>(listener: (...args: any) => void): (...args: SlimeStreamType[K]) => void {
    return listener;
  }

}


interface SlimeStreamType {

  word: [SlimeWordDocument];
  wordEnd: [];
  other: [object];
  otherEnd: [];
  error: [Error];

}