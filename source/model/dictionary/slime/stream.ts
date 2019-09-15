//

import {
  EventEmitter
} from "events";
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


export class SlimeStream extends EventEmitter {

  public path: string;
  public encoding: string;
  private wordPipeline: Readable;

  public constructor(path: string, encoding: string = "utf8") {
    super();
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

  public on<E extends keyof SlimeStreamType>(event: E, listener: (...args: SlimeStreamType[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    super.on(event, listener);
    if (event === "word") {
      this.wordPipeline.on("data", (chunk) => {
        let word = null;
        try {
          word = this.createWord((<any>chunk).value);
        } catch (error) {
          this.emit("error", error);
        }
        if (word) {
          this.emit("word", word);
        }
      });
    } else if (event === "wordEnd") {
      this.wordPipeline.on("end", () => {
        this.emit("wordEnd");
      });
    } else if (event === "error") {
      this.wordPipeline.on("error", (error) => {
        this.emit("error");
      });
    }
    return this;
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

}


interface SlimeStreamType {

  word: [SlimeWordDocument];
  wordEnd: [];
  other: [object];
  otherEnd: [];
  error: [Error];

}