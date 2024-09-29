//

import {WriteStream, createWriteStream} from "fs";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Serializer} from "/server/model/dictionary/serializer/serializer";
import {Example, ExampleModel} from "/server/model/example/example";
import {Word, WordModel} from "/server/model/word/word";


export class SlimeSerializer extends Serializer {

  public constructor(path: string, dictionary: Dictionary) {
    super(path, dictionary);
  }

  public start(): void {
    const writer = createWriteStream(this.path);
    writer.on("error", (error) => {
      this.emit("error", error);
    });
    this.write(writer).then(() => {
      writer.end(() => {
        this.emit("end");
      });
    });
  }

  private async write(writer: WriteStream): Promise<void> {
    writer.write("{");
    writer.write("\"version\":2,");
    writer.write("\"words\":");
    await this.writeWords(writer);
    writer.write(",");
    writer.write("\"examples\":");
    await this.writeExamples(writer);
    writer.write(",");
    writer.write(this.createExternalString());
    writer.write("}");
  }

  private writeWords(writer: WriteStream): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const stream = WordModel.findExist().where("dictionary", this.dictionary).lean().cursor();
      let first = true;
      writer.write("[");
      stream.on("data", (word) => {
        if (first) {
          first = false;
        } else {
          writer.write(",");
        }
        const string = this.createWordString(word);
        writer.write(string);
      });
      stream.on("end", () => {
        writer.write("]");
        resolve();
      });
      stream.on("error", (error) => {
        this.emit("error", error);
        reject(error);
      });
    });
    return promise;
  }

  private writeExamples(writer: WriteStream): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const stream = ExampleModel.findExist().where("dictionary", this.dictionary).lean().cursor();
      let first = true;
      writer.write("[");
      stream.on("data", (example) => {
        if (first) {
          first = false;
        } else {
          writer.write(",");
        }
        const string = this.createExampleString(example);
        writer.write(string);
      });
      stream.on("end", () => {
        writer.write("]");
        resolve();
      });
      stream.on("error", (error) => {
        this.emit("error", error);
        reject(error);
      });
    });
    return promise;
  }

  private createWordString(word: Word): string {
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

  private createExampleString(example: Example): string {
    const raw = {} as any;
    raw["id"] = example.number;
    raw["sentence"] = example.sentence;
    raw["translation"] = (example.offer) ? "" : example.translation;
    raw["supplement"] = example.supplement;
    raw["tags"] = example.tags;
    raw["words"] = [];
    for (const word of example.words ?? []) {
      const rawWord = {} as any;
      rawWord["id"] = word.number;
      raw["words"].push(rawWord);
    }
    if (example.offer) {
      raw["offer"] = {};
      raw["offer"]["catalog"] = example.offer.catalog;
      raw["offer"]["number"] = example.offer.number;
    }
    const string = JSON.stringify(raw);
    return string;
  }

  private createExternalString(): string {
    const raw = {} as any;
    raw["zpdicOnline"] = {};
    raw["zpdicOnline"]["explanation"] = this.dictionary.explanation;
    raw["zpdicOnline"]["punctuations"] = this.dictionary.settings.punctuations;
    raw["zpdicOnline"]["pronunciationTitle"] = this.dictionary.settings.pronunciationTitle;
    raw["zpdicOnline"]["enableMarkdown"] = this.dictionary.settings.enableMarkdown;
    raw["snoj"] = this.dictionary.settings.akrantiainSource;
    raw["zatlin"] = this.dictionary.settings.zatlinSource;
    const string = JSON.stringify(raw).slice(1, -1);
    return string;
  }

}