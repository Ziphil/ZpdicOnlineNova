//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "userSocials"}})
export class UserSocialSchema {

  @prop({required: true})
  public type!: string;

  @prop({required: true})
  public url!: string;

}


export type UserSocial = UserSocialSchema;
export const UserSocialModel = getModelForClass(UserSocialSchema);
