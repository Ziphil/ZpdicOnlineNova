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
  DictionaryListBody
} from "../type/dictionary";
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
  public getUpload(request: Request, response: Response): void {
    response.render("upload.ejs");
  }

  @post("/upload")
  public async postUpload(request: Request, response: Response<string>): Promise<void> {
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
  public async getList(request: Request, response: Response<DictionaryListBody>): Promise<void> {
    let user = request.user!;
    let dictionaries = await SlimeDictionaryModel.findByUser(user);
    let body = [] as DictionaryListBody;
    for (let dictionary of dictionaries) {
      let id = dictionary.id;
      let name = dictionary.name;
      let status = dictionary.status;
      let wordSize = await dictionary.countWords();
      body.push({id, name, status, wordSize});
    }
    response.json(body);
  }

}