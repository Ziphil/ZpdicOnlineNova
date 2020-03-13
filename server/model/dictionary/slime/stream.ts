//

import {
  EventEmitter
} from "events";
import {
  createReadStream
} from "fs";
import {
  parse
} from "JSONStream";
import {
  SlimeEquivalentModel,
  SlimeInformationModel,
  SlimeRelationModel,
  SlimeVariationModel,
  SlimeWordDocument,
  SlimeWordModel
} from "/server/model/dictionary/slime";


export class SlimeStream extends EventEmitter {

  public path: string;
  private stream: any;

  public constructor(path: string) {
    super();
    this.path = path;
    this.stream = this.create(path);
  }

  private create(path: string): any {
    let pattern = ["words", true];
    let stream = createReadStream(path).pipe(parse(pattern));
    stream.on("data", (data) => {
      let word = null;
      try {
        word = this.createWord(data);
      } catch (error) {
        this.emit("error", error);
      }
      if (word) {
        this.emit("word", word);
      }
    });
    stream.on("end", () => {
      this.emit("end");
    });
    stream.on("error", (reason) => {
      this.emit("error", reason.thrown);
    });
    return stream;
  }

  public on<E extends keyof SlimeStreamType>(event: E, listener: (...args: SlimeStreamType[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    super.on(event, listener);
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
  other: [object];
  end: [];
  error: [Error];

}