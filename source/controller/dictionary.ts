//

import {
  NextFunction,
  Request,
  Response
} from "express";
import {
  SlimeDictionaryModel,
  SlimeWordModel
} from "../model/dictionary/slime";
import {
  UserModel
} from "../model/user";
import {
  Controller
} from "./util/class";
import {
  before,
  controller,
  get,
  post
} from "./util/decorator";


@controller("/dictionary")
export class DictionaryController extends Controller {

  @get("/upload")
  private getUpload(request: Request, response: Response): void {
    response.render("upload.ejs");
  }

  @post("/upload")
  private async postUpload(request: Request, response: Response): Promise<void> {
    let user = await UserModel.findOne({name: "Test"}).exec();
    if (user) {
      SlimeDictionaryModel.createUpload("テスト辞書", user, request.file.path);
      response.send("Uploaded");
    } else {
      response.send("User not found");
    }
  }

  @get("/debug")
  private async getDebug(request: Request, response: Response): Promise<void> {
    response.send("First");
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Second");
        resolve();
      }, 10000);
    });
  }

}