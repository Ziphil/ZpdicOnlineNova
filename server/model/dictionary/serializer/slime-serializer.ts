//

import {
  createWriteStream
} from "fs";
import {
  Dictionary,
  Serializer,
  Word,
  WordModel
} from "/server/model/dictionary";


export class SlimeSerializer extends Serializer {

  public constructor(path: string, dictionary: Dictionary) {
    super(path, dictionary);
  }

  public start(): void {
    let stream = WordModel.find().where("dictionary", this.dictionary).lean().cursor();
    let writer = createWriteStream(this.path);
    let first = true;
    writer.write("{\"words\":[");
    stream.on("data", (word) => {
      let string = this.createString(word);
      if (first) {
        first = false;
      } else {
        writer.write(",");
      }
      writer.write(string);
    });
    stream.on("end", () => {
      writer.write("]");
      let externalString = this.createExternalString();
      if (externalString) {
        writer.write(",");
        writer.write(externalString);
      }
      writer.write(",\"version\":1");
      writer.write("}");
      writer.end(() => {
        this.emit("end");
      });
    });
    stream.on("error", (error) => {
      this.emit("error", error);
    });
  }

  private createString(word: Word): string {
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
    if (word.pronunciation !== undefined) {
      let externalData = this.dictionary.externalData as any;
      let title = externalData?.zpdic?.pronunciationTitle ?? "pronunciation";
      let rawInformation = {} as any;
      rawInformation["title"] = title;
      rawInformation["text"] = word.pronunciation;
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

  private createExternalString(): string {
    let externalData = {zpdic: {}, ...this.dictionary.externalData} as any;
    if (this.dictionary.explanation !== undefined) {
      externalData.zpdic.explanation = this.dictionary.explanation;
    }
    if (this.dictionary.snoj !== undefined) {
      externalData.snoj = this.dictionary.snoj;
    }
    externalData.zpdic.punctuations = this.dictionary.settings.punctuations;
    externalData.zpdic.pronunciationTitle = this.dictionary.settings.pronunciationTitle;
    externalData.zpdic.enableMarkdown = this.dictionary.settings.enableMarkdown;
    let string = JSON.stringify(externalData).slice(1, -1);
    return string;
  }

}