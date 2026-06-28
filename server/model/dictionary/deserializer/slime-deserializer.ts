//

import {createReadStream} from "fs";
import {chain} from "stream-chain";
import {parser} from "stream-json";
import {ignore} from "stream-json/filters/Ignore";
import {pick} from "stream-json/filters/Pick";
import {streamArray} from "stream-json/streamers/StreamArray";
import {streamObject} from "stream-json/streamers/StreamObject";
import {Deserializer} from "/server/model/dictionary/deserializer/deserializer";
import {Example, ExampleModel} from "/server/model/example/example";
import {EquivalentModel} from "/server/model/word/equivalent";
import {InformationModel} from "/server/model/word/information";
import {LinkedWordModel} from "/server/model/word/linked-word";
import {RelationModel} from "/server/model/word/relation";
import {SectionModel} from "/server/model/word/section";
import {VariationModel} from "/server/model/word/variation";
import {Word, WordModel} from "/server/model/word/word";


export class SlimeDeserializer extends Deserializer {

  private pronunciationTitle?: string;
  private ignoredEquivalentPattern?: string;

  public start(): void {
    this.readSettings().then(() => Promise.all([this.readWords(), this.readExamples()])).then(() => {
      this.emit("end");
    }).catch((error) => {
      this.emit("error", error);
    });
  }

  /** トップレベルのプロパティを順に読み込み、設定および外部データのイベントを発火します。
   * `words` と `examples` の配列は巨大になり得るためここでは展開せず、それぞれ別パスで逐次読み込みます。 */
  private readSettings(): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const stream = chain([createReadStream(this.path), parser(), ignore({filter: "words"}), ignore({filter: "examples"}), streamObject()]);
      stream.on("data", ({key, value}) => {
        try {
          this.emitSettings(value, key);
          if (key !== "version") {
            this.emit("external", key, value);
          }
        } catch (error) {
          this.emit("error", error);
        }
      });
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
    return promise;
  }

  /** `words` 配列の要素を 1 個ずつ逐次読み込み、単語イベントを発火します。 */
  private readWords(): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const stream = chain([createReadStream(this.path), parser(), pick({filter: "words"}), streamArray()]);
      stream.on("data", ({value}) => {
        try {
          const word = this.createWord(value);
          this.emit("word", word);
        } catch (error) {
          this.emit("error", error);
        }
      });
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
    return promise;
  }

  /** `examples` 配列の要素を 1 個ずつ逐次読み込み、例文イベントを発火します。 */
  private readExamples(): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const stream = chain([createReadStream(this.path), parser(), pick({filter: "examples"}), streamArray()]);
      stream.on("data", ({value}) => {
        try {
          const example = this.createExample(value);
          this.emit("example", example);
        } catch (error) {
          this.emit("error", error);
        }
      });
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
    return promise;
  }

  private emitSettings(data: any, path: string): void {
    if (path === "zpdic") {
      if (typeof data["explanation"] === "string") {
        this.emit("property", "explanation", data["explanation"]);
      }
      if (Array.isArray(data["punctuations"]) && data["punctuations"].every((punctuation) => typeof punctuation === "string")) {
        this.emit("settings", "punctuations", data["punctuations"]);
      }
      if (typeof data["pronunciationTitle"] === "string") {
        this.pronunciationTitle = data["pronunciationTitle"];
        this.emit("settings", "pronunciationTitle", data["pronunciationTitle"]);
      }
    } else if (path === "zpdicOnline") {
      if (typeof data["explanation"] === "string") {
        this.emit("property", "explanation", data["explanation"]);
      }
      if (Array.isArray(data["punctuations"]) && data["punctuations"].every((punctuation) => typeof punctuation === "string")) {
        this.emit("settings", "punctuations", data["punctuations"]);
      }
      if (typeof data["ignoredPattern"] === "string") {
        this.ignoredEquivalentPattern = data["ignoredPattern"];
        this.emit("settings", "ignoredEquivalentPattern", data["ignoredPattern"]);
      }
      if (typeof data["pronunciationTitle"] === "string") {
        this.pronunciationTitle = data["pronunciationTitle"];
        this.emit("settings", "pronunciationTitle", data["pronunciationTitle"]);
      }
      if (typeof data["enableMarkdown"] === "boolean") {
        this.emit("settings", "markdownFeatures", (data["enableMarkdown"]) ? ["basic"] : []);
      }
    } else if (path === "snoj") {
      if (typeof data === "string") {
        this.emit("settings", "akrantiainSource", data);
      }
    } else if (path === "zatlin") {
      if (typeof data === "string") {
        this.emit("settings", "zatlinSource", data);
      }
    }
  }

  private createWord(raw: any): Word {
    const dictionary = this.dictionary;
    const number = parseInt(raw["entry"]["id"], 10);
    const name = raw["entry"]["form"];
    let pronunciation;
    const equivalents = [];
    for (const rawEquivalent of raw["translations"] ?? []) {
      const titles = (rawEquivalent["title"]) ? rawEquivalent["title"] : [];
      const names = rawEquivalent["forms"] ?? [];
      const nameString = (rawEquivalent["rawForms"]) ? rawEquivalent["rawForms"] : names.join(", ");
      const equivalent = new EquivalentModel({titles, names, nameString});
      equivalents.push(equivalent);
    }
    const tags = raw["tags"] ?? [];
    const informations = [];
    for (const rawInformation of raw["contents"] ?? []) {
      if (rawInformation["title"] === this.pronunciationTitle) {
        pronunciation = rawInformation["text"] ?? undefined;
      } else {
        const title = rawInformation["title"] ?? "";
        const text = rawInformation["markdown"] ?? rawInformation["text"] ?? "";
        const information = new InformationModel({title, text});
        informations.push(information);
      }
    }
    const variations = [];
    for (const rawVariation of raw["variations"] ?? []) {
      const title = rawVariation["title"] ?? "";
      const name = rawVariation["form"] ?? "";
      const variation = new VariationModel({title, name});
      variations.push(variation);
    }
    const relations = [];
    for (const rawRelation of raw["relations"] ?? []) {
      const titles = (rawRelation["title"]) ? [rawRelation["title"]] : [];
      const number = parseInt(rawRelation["entry"]["id"], 10);
      const name = rawRelation["entry"]["form"];
      const relation = new RelationModel({titles, number, name});
      relations.push(relation);
    }
    const updatedDate = new Date();
    const section = new SectionModel({equivalents, informations, variations, relations});
    const word = new WordModel({dictionary, number, name, pronunciation, tags, sections: [section], updatedDate});
    return word;
  }

  private createExample(raw: any): Example {
    const dictionary = this.dictionary;
    const number = parseInt(raw["id"], 10);
    const sentence = raw["sentence"] ?? "";
    const translation = (raw["offer"]) ? "" : (raw["translation"] ?? "");
    const supplement = raw["supplement"];
    const tags = raw["tags"] ?? [];
    const words = [];
    for (const rawWord of raw["words"] ?? []) {
      const number = parseInt(rawWord["id"], 10);
      const word = new LinkedWordModel({number});
      words.push(word);
    }
    const offer = (raw["offer"]) ? {catalog: raw["offer"]["catalog"] ?? "", number: parseInt(raw["offer"]["number"], 10)} : undefined;
    const updatedDate = new Date();
    const example = new ExampleModel({dictionary, number, sentence, translation, supplement, tags, words, offer, updatedDate});
    return example;
  }

}