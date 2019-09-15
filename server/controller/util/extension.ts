//

import {
  UserDocument
} from "../../model/user";


declare module "express-serve-static-core" {
  interface Request<P extends Params = ParamsDictionary> {

    user?: UserDocument;

  }
}