//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Notification as NotificationSkeleton
} from "/server/skeleton/notification";
import {
  QueryUtil
} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "notifications"}})
export class NotificationSchema {

  @prop({required: true})
  public type!: string;

  @prop({required: true})
  public date!: Date;

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

  public static async add(type: string, title: string, text: string): Promise<Notification> {
    let notification = new NotificationModel({});
    notification.type = type;
    notification.date = new Date();
    notification.title = title;
    notification.text = text;
    await notification.save();
    return notification;
  }

  public static async findAll(offset?: number, size?: number): Promise<Array<Notification>> {
    let query = NotificationModel.find().sort("-date");
    let restrictedQuery = QueryUtil.restrict(query, offset, size);
    let notifications = await restrictedQuery.exec();
    return notifications;
  }

}


export class NotificationCreator {

  public static create(raw: Notification): NotificationSkeleton {
    let id = raw.id;
    let type = raw.type;
    let date = raw.date.toISOString();
    let title = raw.title;
    let text = raw.text;
    let skeleton = NotificationSkeleton.of({id, type, date, title, text});
    return skeleton;
  }

}


export type Notification = DocumentType<NotificationSchema>;
export let NotificationModel = getModelForClass(NotificationSchema);