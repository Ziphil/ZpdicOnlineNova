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
} from "../../slime-dictionary";


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

  public on<E extends keyof SlimeStreamType>(event: E, listener: (chunk: SlimeStreamType[E]) => void) {
    if (event === "word") {
      this.wordPipeline.on("data", (chunk) => {
        let word = this.createWord(chunk.value);
        listener(word);
      });
    } else if (event === "wordEnd") {
      this.wordPipeline.on("end", listener);
    }
  }

  private createWord(raw: any): SlimeWordDocument {
    let word = new SlimeWordModel({});
    word.number = parseInt(raw["entry"]["id"], 10);
    word.name = raw["entry"]["form"];
    for (let rawEquivalent of raw["translations"]) {
      let equivalent = new SlimeEquivalentModel({});
      equivalent.title = rawEquivalent["title"];
      equivalent.names = rawEquivalent["forms"];
    }
    word.tags = raw["tags"];
    for (let rawInformation of raw["contents"]) {
      let information = new SlimeInformationModel({});
      information.title = rawInformation["title"];
      information.text = rawInformation["text"];
    }
    for (let rawVariation of raw["variations"]) {
      let variation = new SlimeVariationModel({});
      variation.title = rawVariation["title"];
      variation.name = rawVariation["name"];
    }
    for (let rawRelation of raw["relations"]) {
      let relation = new SlimeRelationModel({});
      relation.title = rawRelation["title"];
      relation.number = parseInt(rawRelation["entry"]["id"], 10);
      relation.name = rawRelation["entry"]["name"];
    }
    return word;
  }

}


interface SlimeStreamType {

  word: SlimeWordDocument;
  wordEnd: any;
  other: object;
  otherEnd: any;

}