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
    let dictionary = this.dictionary;
    let number = parseInt(raw["entry"]["id"], 10);
    let name = raw["entry"]["form"];
    let equivalents = [];
    for (let rawEquivalent of raw["translations"] ?? []) {
      let title = rawEquivalent["title"] ?? "";
      let names = rawEquivalent["forms"] ?? [];
      let equivalent = new EquivalentModel({title, names});
      equivalents.push(equivalent);
    }
    let tags = raw["tags"] ?? [];
    let pronunciation;
    let informations = [];
    for (let rawInformation of raw["contents"] ?? []) {
      if (rawInformation["title"] === this.pronunciationTitle) {
        pronunciation = rawInformation["text"] ?? undefined;
      } else {
        let title = rawInformation["title"] ?? "";
        let text = (() => {
          if (this.enableMarkdown) {
            return rawInformation["markdown"] ?? rawInformation["text"] ?? "";
          } else {
            return rawInformation["text"] ?? "";
          }
        })();
        let information = new InformationModel({title, text});
        informations.push(information);
      }
    }
    let variations = [];
    for (let rawVariation of raw["variations"] ?? []) {
      let title = rawVariation["title"] ?? "";
      let name = rawVariation["form"] ?? "";
      let variation = new VariationModel({title, name});
      variations.push(variation);
    }
    let relations = [];
    for (let rawRelation of raw["relations"] ?? []) {
      let title = rawRelation["title"] ?? "";
      let number = parseInt(rawRelation["entry"]["id"], 10);
      let name = rawRelation["entry"]["form"];
      let relation = new RelationModel({title, number, name});
      relations.push(relation);
    }
    let updatedDate = new Date();
    let word = new WordModel({dictionary, number, name, pronunciation, equivalents, tags, informations, variations, relations, updatedDate});
    return word;
  }

}