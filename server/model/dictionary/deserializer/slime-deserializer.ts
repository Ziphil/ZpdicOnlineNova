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
} from "../..";
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
    const stream = oboe(createReadStream(this.path));
    stream.on("node:!.*", (data, jsonPath) => {
      this.emitSettings(data, jsonPath[0]);
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
    const stream = oboe(createReadStream(this.path));
    stream.on("node:!.words.*", (data, jsonPath) => {
      try {
        const word = this.createWord(data);
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
      if (typeof data["enableMarkdown"] === "boolean") {
        this.enableMarkdown = data["enableMarkdown"];
        this.emit("settings", "enableMarkdown", data["enableMarkdown"]);
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
    const equivalents = [];
    for (const rawEquivalent of raw["translations"] ?? []) {
      const titles = (rawEquivalent["title"]) ? rawEquivalent["title"] : [];
      const names = rawEquivalent["forms"] ?? [];
      const equivalent = new EquivalentModel({titles, names});
      equivalents.push(equivalent);
    }
    const tags = raw["tags"] ?? [];
    let pronunciation;
    const informations = [];
    for (const rawInformation of raw["contents"] ?? []) {
      if (rawInformation["title"] === this.pronunciationTitle) {
        pronunciation = rawInformation["text"] ?? undefined;
      } else {
        const title = rawInformation["title"] ?? "";
        const text = (() => {
          if (this.enableMarkdown) {
            return rawInformation["markdown"] ?? rawInformation["text"] ?? "";
          } else {
            return rawInformation["text"] ?? "";
          }
        })();
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
    const word = new WordModel({dictionary, number, name, pronunciation, equivalents, tags, informations, variations, relations, updatedDate});
    return word;
  }

}