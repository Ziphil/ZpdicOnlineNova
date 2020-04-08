//

import {
  EventEmitter
} from "events";
import {
  createWriteStream
} from "fs";
import {
  SlimeDictionaryDocument,
  SlimeWordDocument,
  SlimeWordModel
} from "/server/model/dictionary/slime";


export class SlimeSerializer extends EventEmitter {

  public path: string;
  public dictionary: SlimeDictionaryDocument;
  private error: Error | null = null;

  public constructor(path: string, dictionary: SlimeDictionaryDocument) {
    super();
    this.path = path;
    this.dictionary = dictionary;
  }

  public start(): void {
    let stream = SlimeWordModel.find().where("dictionary", this.dictionary).cursor();
    let writer = createWriteStream(this.path);
    stream.on("data", (word) => {
      let string = this.createString(word);
      writer.write(string);
    });
    stream.on("end", () => {
      if (!this.error) {
        writer.end();
        this.emit("end");
      }
    });
    stream.on("error", (error) => {
      this.error = error;
      this.emit("error", error);
    });
  }

  public on<E extends keyof SlimeSerializerType>(event: E, listener: (...args: SlimeSerializerType[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    super.on(event, listener);
    return this;
  }

  private createString(word: SlimeWordDocument): string {
    let raw = {} as any;
    raw["entry"] = {};
    raw["entry"]["id"] = word.number;
    raw["entry"]["form"] = word.name;
    raw["translations"] = [];
    for (let equivalent of word.equivalents) {
      let rawEquivalent = {} as any;
      rawEquivalent["title"] = equivalent.title;
      rawEquivalent["forms"] = equivalent.names;
      raw["translations"].push(rawEquivalent);
    }
    raw["tags"] = word.tags;
    raw["contents"] = [];
    for (let information of word.informations) {
      let rawInformation = {} as any;
      rawInformation["title"] = information.title;
      rawInformation["text"] = information.text;
      raw["contents"].push(rawInformation);
    }
    raw["variations"] = [];
    for (let variation of word.variations) {
      let rawVariation = {} as any;
      rawVariation["title"] = variation.title;
      rawVariation["form"] = variation.name;
      raw["variations"].push(rawVariation);
    }
    raw["relations"] = [];
    for (let relation of word.relations) {
      let rawRelation = {} as any;
      rawRelation["title"] = relation.title;
      rawRelation["entry"] = {};
      rawRelation["entry"]["id"] = relation.number;
      rawRelation["entry"]["form"] = relation.name;
      raw["relations"].push(rawRelation);
    }
    let string = JSON.stringify(raw);
    return string;
  }

}


interface SlimeSerializerType {

  end: [];
  error: [Error];

}