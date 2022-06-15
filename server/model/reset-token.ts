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
    const name = createRandomString(10, true);
    const secret = createRandomString(30, false);
    const key = name + secret;
    const hash = hashSync(secret, 10);
    const date = new Date();
    const resetToken = new ResetTokenModel({name, hash, date});
    return [resetToken, key];
  }

  public static getName(key: string): string {
    const name = key.substring(0, 23);
    return name;
  }

  public checkKey(key: string): boolean {
    const secret = key.substring(23, 53);
    return compareSync(secret, this.hash);
  }

  public checkTime(timeout?: number): boolean {
    if (timeout !== undefined) {
      const createdDate = this.date;
      const currentDate = new Date();
      const elapsedMinute = (currentDate.getTime() - createdDate.getTime()) / (60 * 1000);
      return elapsedMinute < timeout;
    } else {
      return true;
    }
  }

}


export type ResetToken = ResetTokenSchema;
export const ResetTokenModel = getModelForClass(ResetTokenSchema);