//

import {
  createReadStream
} from "fs";
import oboe from "oboe";
import {
  EquivalentModel,
  InformationModel,
  RelationModel,
  VariationModel,
  Word,
  WordModel
} from "/server/model/dictionary";
import {
  Deserializer
} from "/server/model/dictionary/deserializer/deserializer";


export class SlimeDeserializer extends Deserializer {

  private pronunciationTitle?: string;
  private enableMarkdown?: boolean;

  public start(): void {
    this.readSettings();
  }

  private readSettings(): void {
    let stream = oboe(createReadStream(this.path));
    stream.on("node:!.*", (data, jsonPath) => {
      if (jsonPath[0] === "zpdic") {
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
      } else if (jsonPath[0] === "zpdicOnline") {
        if (typeof data["explanation"] === "string") {
          this.emit("property", "explanation", data["explanation"]);
        }
        if (typeof data["enableMarkdown"] === "boolean") {
          this.enableMarkdown = data["enableMarkdown"];
          this.emit("settings", "enableMarkdown", data["enableMarkdown"]);
        }
      } else if (jsonPath[0] === "snoj") {
        if (typeof data === "string") {
          this.emit("settings", "akrantiainSource", data);
        }
      } else if (jsonPath[0] === "zatlin") {
        if (typeof data === "string") {
          this.emit("settings", "zatlinSource", data);
        }
      }
      return oboe.drop;
    });
    stream.on("done", () => {
      this.readMain();
    });
    stream.on("fail", (reason) => {
      this.emit("error", reason.thrown);
    });
  }

  private readMain(): void {
    let stream = oboe(createReadStream(this.path));
    stream.on("node:!.words.*", (data, jsonPath) => {
      try {
        let word = this.createWord(data);
        this.emit("word", word);
      } catch (error) {
        this.emit("error", error);
      }
      return oboe.drop;
    });
    stream.on("node:!.*", (data, jsonPath) => {
      if (jsonPath[0] !== "words" && jsonPath[0] !== "version") {
        this.emit("external", jsonPath[0], data);
      }
      return oboe.drop;
    });
    stream.on("done", () => {
      this.emit("end");
    });
    stream.on("fail", (reason) => {
      this.emit("error", reason.thrown);
    });
  }

  private createWord(raw: any): Word {
    let word = new WordModel({});
    word.dictionary = this.dictionary;
    word.number = parseInt(raw["entry"]["id"], 10);
    word.name = raw["entry"]["form"];
    word.equivalents = [];
    for (let rawEquivalent of raw["translations"] ?? []) {
      let equivalent = new EquivalentModel({});
      equivalent.title = rawEquivalent["title"] ?? "";
      equivalent.names = rawEquivalent["forms"] ?? [];
      word.equivalents.push(equivalent);
    }
    word.tags = raw["tags"] ?? [];
    word.informations = [];
    for (let rawInformation of raw["contents"] ?? []) {
      if (rawInformation["title"] === this.pronunciationTitle) {
        word.pronunciation = rawInformation["text"] ?? undefined;
      } else {
        let information = new InformationModel({});
        information.title = rawInformation["title"] ?? "";
        if (this.enableMarkdown) {
          information.text = rawInformation["markdown"] ?? rawInformation["text"] ?? "";
        } else {
          information.text = rawInformation["text"] ?? "";
        }
        word.informations.push(information);
      }
    }
    word.variations = [];
    for (let rawVariation of raw["variations"] ?? []) {
      let variation = new VariationModel({});
      variation.title = rawVariation["title"] ?? "";
      variation.name = rawVariation["form"] ?? "";
      word.variations.push(variation);
    }
    word.relations = [];
    for (let rawRelation of raw["relations"] ?? []) {
      let relation = new RelationModel({});
      relation.title = rawRelation["title"] ?? "";
      relation.number = parseInt(rawRelation["entry"]["id"], 10);
      relation.name = rawRelation["entry"]["form"];
      word.relations.push(relation);
    }
    return word;
  }

}