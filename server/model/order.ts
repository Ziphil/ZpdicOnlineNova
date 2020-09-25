//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Dictionary,
  DictionarySchema
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  Order as OrderSkeleton
} from "/server/skeleton/order";


@modelOptions({schemaOptions: {collection: "orders"}})
export class OrderSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public name!: string;

  @prop({})
  public comment?: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async add(dictionary: Dictionary, name: string, comment?: string): Promise<Order> {
    let order = new OrderModel({});
    order.dictionary = dictionary;
    order.name = name;
    order.comment = (comment === "") ? undefined : comment;
    order.createdDate = new Date();
    await order.save();
    return order;
  }

}


export class OrderCreator {

  public static create(raw: Order): OrderSkeleton {
    let id = raw.id;
    let name = raw.name;
    let comment = raw.comment;
    let createdDate = raw.createdDate.toISOString();
    let skeleton = OrderSkeleton.of({id, name, comment, createdDate});
    return skeleton;

  }

}


export type Order = DocumentType<OrderSchema>;
export let OrderModel = getModelForClass(OrderSchema);