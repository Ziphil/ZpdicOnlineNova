//

import {createWriteStream} from "fs";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Serializer} from "/server/model/dictionary/serializer/serializer";
import {Word, WordModel} from "/server/model/word/word";


export class SlimeSerializer extends Serializer {

  public constructor(path: string, dictionary: Dictionary) {
    super(path, dictionary);
  }

  public start(): void {
    const stream = WordModel.findExist().where("dictionary", this.dictionary).lean().cursor();
    const writer = createWriteStream(this.path);
    let first = true;
    writer.write("{\"words\":[");
    stream.on("data", (word) => {
      const string = this.createString(word);
      if (first) {
        first = false;
      } else {
        writer.write(",");
      }
      writer.write(string);
    });
    stream.on("end", () => {
      writer.write("]");
      const externalString = this.createExternalString();
      if (externalString) {
        writer.write(",");
        writer.write(externalString);
      }
      writer.write(",\"version\":2");
      writer.write("}");
      writer.end(() => {
        this.emit("end");
      });
    });
    stream.on("error", (error) => {
      this.emit("error", error);
    });
    writer.on("error", (error) => {
      this.emit("error", error);
    });
  }

  private createString(word: Word): string {
    const raw = {} as any;
    raw["entry"] = {};
    raw["entry"]["id"] = word.number;
    raw["entry"]["form"] = word.name;
    raw["translations"] = [];
    for (const equivalent of word.equivalents ?? []) {
      const rawEquivalent = {} as any;
      rawEquivalent["title"] = equivalent.titles[0] ?? "";
      rawEquivalent["forms"] = equivalent.names;
      raw["translations"].push(rawEquivalent);
    }
    raw["tags"] = word.tags;
    raw["contents"] = [];
    for (const information of word.informations ?? []) {
      const rawInformation = {} as any;
      rawInformation["title"] = information.title;
      rawInformation["text"] = information.text;
      raw["contents"].push(rawInformation);
    }
    if (word.pronunciation !== undefined) {
      const title = this.dictionary.settings.pronunciationTitle;
      const rawInformation = {} as any;
      rawInformation["title"] = title;
      rawInformation["text"] = word.pronunciation;
      raw["contents"].push(rawInformation);
    }
    raw["variations"] = [];
    for (const variation of word.variations ?? []) {
      const rawVariation = {} as any;
      rawVariation["title"] = variation.title;
      rawVariation["form"] = variation.name;
      raw["variations"].push(rawVariation);
    }
    raw["relations"] = [];
    for (const relation of word.relations ?? []) {
      const rawRelation = {} as any;
      rawRelation["title"] = relation.titles[0] ?? "";
      rawRelation["entry"] = {};
      rawRelation["entry"]["id"] = relation.number;
      rawRelation["entry"]["form"] = relation.name;
      raw["relations"].push(rawRelation);
    }
    const string = JSON.stringify(raw);
    return string;
  }

  private createExternalString(): string {
    let externalData = {} as any;
    externalData["zpdicOnline"] = {};
    externalData = Object.assign({}, externalData, this.dictionary.externalData);
    externalData["zpdicOnline"]["explanation"] = this.dictionary.explanation;
    externalData["zpdicOnline"]["punctuations"] = this.dictionary.settings.punctuations;
    externalData["zpdicOnline"]["pronunciationTitle"] = this.dictionary.settings.pronunciationTitle;
    externalData["zpdicOnline"]["enableMarkdown"] = this.dictionary.settings.enableMarkdown;
    externalData["snoj"] = this.dictionary.settings.akrantiainSource;
    externalData["zatlin"] = this.dictionary.settings.zatlinSource;
    const string = JSON.stringify(externalData).slice(1, -1);
    return string;
  }

}