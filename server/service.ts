//

import * as typegoose from "@typegoose/typegoose";
import mongoose from "mongoose";
import {
  SchemaTypes
} from "mongoose";
import {
  MONGO_URI
} from "/server/variable";


export class Service {

  public main(): void {
    this.setupMongo();
    this.execute();
  }

  private setupMongo(): void {
    let check = function (value: string): boolean {
      return value !== null;
    };
    let SchemaString = SchemaTypes.String as any;
    SchemaString.checkRequired(check);
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private execute(): void {
    let name = process.argv[2];
    if (name === "history") {
      console.log("hello");
    }
  }

}


let service = new Service();
service.main();