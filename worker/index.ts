//

import * as typegoose from "@typegoose/typegoose";
import fs from "fs/promises";
import mongoose from "mongoose";
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
  addHistoriesQueue,
  uploadDictionaryQueue
} from "/worker/queue";


export class Main {

  public async main(): Promise<void> {
    this.setupMongo();
    this.setupWorkers();
    this.setupSchedules();
    this.listen();
  }

  private setupMongo(): void {
    MongoUtil.setCheckRequired("String");
    mongoose.connect(MONGO_URI);
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupWorkers(): void {
    uploadDictionaryQueue.process(async (job) => {
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
        throw error;
      }
    });
    addHistoriesQueue.process(async (job) => {
      LogUtil.log("worker/addHistories", job.data);
      await HistoryController.addHistories();
    });
  }

  private setupSchedules(): void {
    addHistoriesQueue.add({}, {repeat: {cron: "30 23 * * *", tz: "Asia/Tokyo"}});
  }

  private listen(): void {
    LogUtil.log("worker", null);
  }

}


const main = new Main();
main.main();