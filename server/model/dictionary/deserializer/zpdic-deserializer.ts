//

import {createReadStream} from "fs";
import {chain} from "stream-chain";
import {parser} from "stream-json";
import {pick} from "stream-json/filters/Pick";
import {streamArray} from "stream-json/streamers/StreamArray";
import {WordCreator} from "/server/external-alpha/creator";
import {ExampleCreator} from "/server/external-alpha/creator/example/example";
import {EditableExample$In as EditableExample, EditableWord$In as EditableWord} from "/server/external-alpha/schema";
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
    const updatedDate = new Date();
    const enfleshedWord = WordCreator.enflesh(EditableWord.cast(raw));
    const word = new WordModel({dictionary, number, ...enfleshedWord, updatedDate});
    return word;
  }

  private createExample(raw: any): Example {
    const dictionary = this.dictionary;
    const number = raw["number"];
    const updatedDate = new Date();
    const enfleshedExample = ExampleCreator.enflesh(EditableExample.cast(raw));
    const example = new ExampleModel({dictionary, number, ...enfleshedExample, updatedDate});
    return example;
  }

}
