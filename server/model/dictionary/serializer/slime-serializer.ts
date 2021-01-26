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
import {
  removeMarkdown
} from "/server/util/misc";


export class SlimeSerializer extends Serializer {

  public constructor(path: string, dictionary: Dictionary) {
    super(path, dictionary);
  }

  public start(): void {
    let stream = WordModel.findExist().where("dictionary", this.dictionary).lean().cursor();
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
      writer.write(",\"version\":2");
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
      if (this.dictionary.settings.enableMarkdown) {
        rawInformation["text"] = removeMarkdown(information.text);
        rawInformation["markdown"] = information.text;
      } else {
        rawInformation["text"] = information.text;
      }
      raw["contents"].push(rawInformation);
    }
    if (word.pronunciation !== undefined) {
      let title = this.dictionary.settings.pronunciationTitle;
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
    let externalData = {} as any;
    externalData["zpdic"] = {};
    externalData["zpdicOnline"] = {};
    externalData = Object.assign({}, externalData, this.dictionary.externalData);
    if (this.dictionary.explanation !== undefined) {
      externalData["zpdicOnline"]["explanation"] = this.dictionary.explanation;
    }
    if (this.dictionary.settings.akrantiainSource !== undefined) {
      externalData["snoj"] = this.dictionary.settings.akrantiainSource;
    }
    if (this.dictionary.settings.zatlinSource !== undefined) {
      externalData["zatlin"] = this.dictionary.settings.zatlinSource;
    }
    externalData["zpdic"]["punctuations"] = this.dictionary.settings.punctuations;
    externalData["zpdic"]["pronunciationTitle"] = this.dictionary.settings.pronunciationTitle;
    externalData["zpdicOnline"]["enableMarkdown"] = this.dictionary.settings.enableMarkdown;
    let string = JSON.stringify(externalData).slice(1, -1);
    return string;
  }

}