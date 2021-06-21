//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  compareSync,
  hashSync
} from "bcrypt";
import {
  createRandomString
} from "/server/util/misc";


export class ResetTokenSchema {

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public hash!: string;

  @prop({required: true})
  public date!: Date;

  public static build(): [ResetToken, string] {
    let name = createRandomString(10, true);
    let secret = createRandomString(30, false);
    let key = name + secret;
    let hash = hashSync(secret, 10);
    let date = new Date();
    let resetToken = new ResetTokenModel({name, hash, date});
    return [resetToken, key];
  }

  public static getName(key: string): string {
    let name = key.substring(0, 23);
    return name;
  }

  public compare(key: string): boolean {
    let secret = key.substring(23, 53);
    return compareSync(secret, this.hash);
  }

  public checkTime(timeout?: number): boolean {
    if (timeout !== undefined) {
      let createdDate = this.date;
      let currentDate = new Date();
      let elapsedMinute = (currentDate.getTime() - createdDate.getTime()) / (60 * 1000);
      return elapsedMinute < timeout;
    } else {
      return true;
    }
  }

}


export type ResetToken = ResetTokenSchema;
export let ResetTokenModel = getModelForClass(ResetTokenSchema);