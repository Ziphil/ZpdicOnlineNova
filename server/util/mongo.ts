//

import {ObjectId} from "bson";
import {SchemaTypes} from "mongoose";


export function setMongoCheckRequired(name: keyof typeof SchemaTypes): void {
  const SchemaType = SchemaTypes[name] as any as SchemaTypeStatic;
  SchemaType.checkRequired((value) => value !== null);
}

export function toObjectid(value: string): ObjectId {
  return new ObjectId(value);
}

type SchemaTypeStatic = {
  checkRequired: (check: (value: any) => boolean) => void
};