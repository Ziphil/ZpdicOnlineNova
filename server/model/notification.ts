//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class Notification {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public date!: Date;

  @prop({required: true})
  public type!: string;

  @prop({required: true})
  public text!: string;

  public static async findAll(offset?: number, size?: number): Promise<Array<NotificationDocument>> {
    let query = NotificationModel.find().sort("-date");
    if (offset !== undefined) {
      query = query.skip(offset);
    }
    if (size !== undefined) {
      query = query.limit(size);
    }
    let notifications = await query.exec();
    return notifications;
  }

}


export type NotificationDocument = DocumentType<Notification>;
export let NotificationModel = getModelForClass(Notification);