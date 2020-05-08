//

import {
  EventEmitter
} from "events";
import {
  createReadStream
} from "fs";
import * as oboe from "oboe";
import {
  EquivalentModel,
  InformationModel,
  RelationModel,
  VariationModel,
  WordDocument,
  WordModel
} from "/server/model/dictionary";


export class DictionaryDeserializer extends EventEmitter {

  public path: string;
  private error: Error | null = null;

  public constructor(path: string) {
    super();
    this.path = path;
  }

  public on<E extends keyof Event>(event: E, listener: (...args: Event[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    super.on(event, listener);
    return this;
  }

  public start(): void {
    let stream = oboe(createReadStream(this.path));
    stream.on("node:words.*", (data, jsonPath) => {
      let word = null;
      try {
        word = this.createWord(data);
      } catch (error) {
        this.error = error;
        this.emit("error", error);
      }
      if (word) {
        this.emit("word", word);
      }
    });
    stream.on("node:!.*", (data, jsonPath) => {
      if (jsonPath[0] !== "words") {
        this.emit("other", jsonPath[0], data);
      }
    });
    stream.on("done", () => {
      if (!this.error) {
        this.emit("end");
      }
    });
    stream.on("fail", (reason) => {
      this.error = reason.thrown;
      this.emit("error", reason.thrown);
    });
  }

  private createWord(raw: any): WordDocument {
    let word = new WordModel({});
    word.number = parseInt(raw["entry"]["id"], 10);
    word.name = raw["entry"]["form"];
    word.equivalents = [];
    for (let rawEquivalent of raw["translations"]) {
      let equivalent = new EquivalentModel({});
      equivalent.title = rawEquivalent["title"];
      equivalent.names = rawEquivalent["forms"];
      word.equivalents.push(equivalent);
    }
    word.tags = raw["tags"];
    word.informations = [];
    for (let rawInformation of raw["contents"]) {
      let information = new InformationModel({});
      information.title = rawInformation["title"];
      information.text = rawInformation["text"];
      word.informations.push(information);
    }
    word.variations = [];
    for (let rawVariation of raw["variations"]) {
      let variation = new VariationModel({});
      variation.title = rawVariation["title"];
      variation.name = rawVariation["form"];
      word.variations.push(variation);
    }
    word.relations = [];
    for (let rawRelation of raw["relations"]) {
      let relation = new RelationModel({});
      relation.title = rawRelation["title"];
      relation.number = parseInt(rawRelation["entry"]["id"], 10);
      relation.name = rawRelation["entry"]["form"];
      word.relations.push(relation);
    }
    return word;
  }

}


type Event = {
  word: [WordDocument],
  other: [string, any],
  end: [],
  error: [Error]
};