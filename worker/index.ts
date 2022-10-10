//

import * as typegoose from "@typegoose/typegoose";
import fs from "fs/promises";
import mongoose from "mongoose";
import {
  schedule
} from "node-cron";
import {
  HistoryController
} from "/server/controller/internal";
import {
  DictionaryModel
} from "/server/model/dictionary";
import {
  LogUtil
} from "/server/util/log";
import {
  MongoUtil
} from "/server/util/mongo";
import {
  MONGO_URI
} from "/server/variable";
import {
  uploadDictionaryQueue
} from "/worker/queue";


export class Main {

  public async main(): Promise<void> {
    this.setupMongo();
    this.setupWorkers();
    this.setupCron();
    this.listen();
  }

  private setupMongo(): void {
    MongoUtil.setCheckRequired("String");
    mongoose.connect(MONGO_URI);
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupWorkers(): void {
    uploadDictionaryQueue.process(async (job, done) => {
      LogUtil.log("worker/uploadDictionary", job.data);
      const {number, path, originalPath} = job.data;
      try {
        const dictionary = await DictionaryModel.fetchOneByNumber(number);
        if (dictionary !== null) {
          await dictionary.upload(path, originalPath);
          await fs.unlink(path);
        }
      } catch (error) {
        LogUtil.error("worker/uploadDictionary", null, error);
      }
      done();
    });
  }

  private setupCron(): void {
    schedule("0 30 23 * * *", async () => {
      await HistoryController.addHistories();
    }, {timezone: "Asia/Tokyo"});
  }

  private listen(): void {
    LogUtil.log("worker", null);
  }

}


const main = new Main();
main.main();