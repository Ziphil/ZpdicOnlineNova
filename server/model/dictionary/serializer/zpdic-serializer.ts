//

import {WriteStream, createWriteStream} from "fs";
import {WordCreator} from "/server/external-alpha/creator";
import {ExampleCreator} from "/server/external-alpha/creator/example/example";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Serializer} from "/server/model/dictionary/serializer/serializer";
import {Example, ExampleModel} from "/server/model/example/example";
import {Word, WordModel} from "/server/model/word/word";


export class ZpdicSerializer extends Serializer {

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
    writer.write("\"version\":1,");
    writer.write("\"words\":");
    await this.writeWords(writer);
    writer.write(",");
    writer.write("\"examples\":");
    await this.writeExamples(writer);
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
    const raw = WordCreator.skeletonize(word);
    const string = JSON.stringify(raw);
    return string;
  }

  private createExampleString(example: Example): string {
    const raw = ExampleCreator.skeletonize(example);
    const string = JSON.stringify(raw);
    return string;
  }

}