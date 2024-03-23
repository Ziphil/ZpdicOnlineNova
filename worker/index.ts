//

import * as typegoose from "@typegoose/typegoose";
import mongoose from "mongoose";
import {LogUtil} from "/server/util/log";
import {setMongoCheckRequired} from "/server/util/mongo";
import {MONGO_URI} from "/server/variable";


export class Main {

  public async main(): Promise<void> {
    this.setupMongo();
    this.setupWorkers();
    this.setupSchedules();
    this.listen();
  }

  private setupMongo(): void {
    setMongoCheckRequired("String");
    mongoose.connect(MONGO_URI);
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupWorkers(): void {
  }

  private setupSchedules(): void {
  }

  private listen(): void {
    LogUtil.log("worker", null);
  }

}


const main = new Main();
main.main();