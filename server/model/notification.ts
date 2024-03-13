//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import type {
  Notification as NotificationSkeleton
} from "/client/skeleton";
import {WithSize} from "/server/controller/internal/type";
import {QueryRange} from "/server/util/query";


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
    const date = new Date();
    const notification = new NotificationModel({type, date, title, text});
    await notification.save();
    return notification;
  }

  public static async fetch(range?: QueryRange): Promise<WithSize<Notification>> {
    const query = NotificationModel.find().sort("-date");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

}


export class NotificationCreator {

  public static create(raw: Notification): NotificationSkeleton {
    const id = raw.id;
    const type = raw.type;
    const date = raw.date.toISOString();
    const title = raw.title;
    const text = raw.text;
    const skeleton = {id, type, date, title, text};
    return skeleton;
  }

}


export type Notification = DocumentType<NotificationSchema>;
export const NotificationModel = getModelForClass(NotificationSchema);