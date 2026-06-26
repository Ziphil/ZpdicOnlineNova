//

import {createReadStream} from "fs";
import {chain} from "stream-chain";
import {parser} from "stream-json";
import {pick} from "stream-json/filters/Pick";
import {streamArray} from "stream-json/streamers/StreamArray";
import {WordCreator} from "/server/external-alpha/creator";
import {ExampleCreator} from "/server/external-alpha/creator/example/example";
import {EditableExample$In, EditableWord$In} from "/server/external-alpha/schema";
import {Deserializer} from "/server/model/dictionary/deserializer/deserializer";
import {Example, ExampleModel} from "/server/model/example/example";
import {Word, WordModel} from "/server/model/word/word";


export class ZpdicDeserializer extends Deserializer {

  public start(): void {
    Promise.all([this.readWords(), this.readExamples()]).then(() => {
      this.emit("end");
    }).catch((error) => {
      this.emit("error", error);
    });
  }

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

  private createWord(raw: any): Word {
    const dictionary = this.dictionary;
    const number = raw["number"];
    const enfleshed = WordCreator.enflesh(EditableWord$In.cast(raw));
    const updatedDate = new Date();
    const word = new WordModel({dictionary, number, ...enfleshed, updatedDate});
    return word;
  }

  private createExample(raw: any): Example {
    const dictionary = this.dictionary;
    const number = raw["number"];
    const enfleshed = ExampleCreator.enflesh(EditableExample$In.cast(raw));
    const updatedDate = new Date();
    const example = new ExampleModel({dictionary, number, ...enfleshed, updatedDate});
    return example;
  }

}
