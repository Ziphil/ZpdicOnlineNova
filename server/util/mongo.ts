//

import {SchemaTypes, mongo} from "mongoose";


export function setMongoCheckRequired(name: keyof typeof SchemaTypes): void {
  const SchemaType = SchemaTypes[name] as any as SchemaTypeStatic;
  SchemaType.checkRequired((value) => value !== null);
}

export function toObjectId(value: string): any {
  const ObjectId = mongo["ObjectId"];
  return new ObjectId(value);
}

type SchemaTypeStatic = {checkRequired: (check: (value: any) => boolean) => void};