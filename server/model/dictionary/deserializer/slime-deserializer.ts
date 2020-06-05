//

import {
  createReadStream
} from "fs";
import * as oboe from "oboe";
import {
  Deserializer,
  EquivalentModel,
  InformationModel,
  RelationModel,
  VariationModel,
  Word,
  WordModel
} from "/server/model/dictionary";
import {
  takeLog
} from "/server/util/misc";


export class SlimeDeserializer extends Deserializer {

  private error: Error | null = null;

  public constructor(path: string) {
    super(path);
  }

  public start(): void {
    let stream = oboe(createReadStream(this.path));
    stream.on("node:!.words.*", (data, jsonPath) => {
      try {
        let word = this.createWord(data);
        this.emit("word", word);
      } catch (error) {
        this.error = error;
        this.emit("error", error);
      }
      return oboe.drop;
    });
    stream.on("node:!.*", (data, jsonPath) => {
      if (jsonPath[0] !== "words") {
        this.emit("other", jsonPath[0], data);
      }
      takeLog("dictionary-deserializer", `${jsonPath[0]}`);
      return oboe.drop;
    });
    stream.on("done", (finalData) => {
      if (!this.error) {
        this.emit("end");
      }
    });
    stream.on("fail", (reason) => {
      this.error = reason.thrown;
      this.emit("error", reason.thrown);
    });
  }

  private createWord(raw: any): Word {
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