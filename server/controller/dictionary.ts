//

import {
  Request,
  Response
} from "express-serve-static-core";
import {
  DictionaryBody,
  DictionaryListBody,
  MayError
} from "/client/type";
import {
  Controller
} from "/server/controller/controller";
import * as middle from "/server/controller/middle";
import {
  SlimeDictionaryModel
} from "/server/model/dictionary/slime";
import {
  UserModel
} from "/server/model/user";
import {
  before,
  controller,
  get,
  post
} from "/server/util/decorator";


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

  @get("/search")
  public async getSearch(request: Request, response: Response<any>): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let search = request.query.search;
    let mode = request.query.mode;
    let type = request.query.type;
    let offset = parseInt(request.query.offset, 10) || 0;
    let size = parseInt(request.query.size, 10) || 0;
    let dictionary = await SlimeDictionaryModel.findByNumber(number);
    if (dictionary) {
      let words = await dictionary.search(search, mode, type, offset, size);
      response.json(words);
    } else {
      response.status(400).json({error: "invalidNumber"});
    }
  }

  @get("/info")
  public async getInfo(request: Request, response: Response<MayError<DictionaryBody>>): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let dictionary = await SlimeDictionaryModel.findByNumber(number);
    if (dictionary) {
      let id = dictionary.id;
      let name = dictionary.name;
      let status = dictionary.status;
      response.json({id, number, name, status});
    } else {
      response.status(400).json({error: "invalidNumber"});
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
      let number = dictionary.number;
      let name = dictionary.name;
      let status = dictionary.status;
      let wordSize = await dictionary.countWords();
      body.push({id, number, name, status, wordSize});
    }
    response.json(body);
  }

}