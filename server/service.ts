//

import * as typegoose from "@typegoose/typegoose";
import mongoose from "mongoose";
import {
  HistoryController
} from "/server/controller/internal";
import {
  MongoUtil
} from "/server/util/mongo";
import {
  MONGO_URI
} from "/server/variable";


export class Service {

  public async main(): Promise<void> {
    this.setupMongo();
    await this.execute();
    this.closeMongo();
  }

  private setupMongo(): void {
    MongoUtil.setCheckRequired("String");
    mongoose.connect(MONGO_URI);
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private closeMongo(): void {
    mongoose.connection.close();
  }

  private async execute(): Promise<void> {
    const name = process.argv[2];
    if (name === "history") {
      await HistoryController.addHistories();
    }
  }

}


const service = new Service();
service.main();