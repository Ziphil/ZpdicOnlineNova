//

import {
  Request,
  Response
} from "express-serve-static-core";
import {
  SlimeDictionaryModel
} from "../model/dictionary/slime";
import {
  UserModel
} from "../model/user";
import {
  before,
  controller,
  get,
  post
} from "../util/decorator";
import {
  Controller
} from "./controller";
import * as middle from "./middle";


@controller("/api/dictionary")
export class DictionaryController extends Controller {

  @get("/upload")
  private getUpload(request: Request, response: Response): void {
    response.render("upload.ejs");
  }

  @post("/upload")
  private async postUpload(request: Request, response: Response): Promise<void> {
    let user = await UserModel.findOne({name: "Test"}).exec();
    if (user) {
      SlimeDictionaryModel.registerUpload("テスト辞書", user, request.file.path);
      response.send("Uploaded");
    } else {
      response.send("User not found");
    }
  }

  @get("/list")
  @before(middle.verifyToken())
  private async getList(request: Request, response: Response): Promise<void> {
    let user = request.user!;
    let dictionaries = await SlimeDictionaryModel.findByUser(user);
    let result = [];
    for (let dictionary of dictionaries) {
      let id = dictionary.id;
      let name = dictionary.name;
      let status = dictionary.status;
      let wordSize = await dictionary.countWords();
      result.push({id, name, status, wordSize});
    }
    response.json(result);
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