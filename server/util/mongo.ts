//

import {
  SchemaTypes
} from "mongoose";


export class MongoUtil {

  public static setCheckRequired(name: keyof typeof SchemaTypes): void {
    const SchemaType = SchemaTypes[name] as any as SchemaTypeStatic;
    SchemaType.checkRequired((value) => value !== null);
  }

}


type SchemaTypeStatic = {
  checkRequired: (check: (value: any) => boolean) => void
};