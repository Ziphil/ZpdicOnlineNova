//

import {
  Request,
  Response
} from "express-serve-static-core";
import {
  Controller
} from "/server/controller/controller";
import * as middle from "/server/controller/middle";
import {
  SlimeDictionaryModel,
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/model/dictionary/slime";
import {
  CustomErrorSkeleton,
  MayError
} from "/server/model/error";
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
  public async getSearch(request: Request, response: Response<DictionarySearchBody>): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let search = request.query.search;
    let mode = request.query.mode;
    let type = request.query.type;
    let offset = parseInt(request.query.offset, 10) || 0;
    let size = parseInt(request.query.size, 10) || 0;
    let dictionary = await SlimeDictionaryModel.findByNumber(number);
    if (dictionary) {
      let words = await dictionary.search(search, mode, type, offset, size);
      let body = words.map((word) => new SlimeWordSkeleton(word));
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidNumber");
      response.status(400).json(body);
    }
  }

  @get("/info")
  public async getInfo(request: Request, response: Response<DictionaryInfoBody>): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let dictionary = await SlimeDictionaryModel.findByNumber(number);
    if (dictionary) {
      let body = new SlimeDictionarySkeleton(dictionary);
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidNumber");
      response.status(400).json(body);
    }
  }

  @get("/list")
  @before(middle.verifyToken())
  public async getList(request: Request, response: Response<DictionaryListBody>): Promise<void> {
    let user = request.user!;
    let dictionaries = await SlimeDictionaryModel.findByUser(user);
    let body = [];
    for (let dictionary of dictionaries) {
      let innerSkeleton = new SlimeDictionarySkeleton(dictionary);
      await innerSkeleton.fetch(dictionary);
      body.push(innerSkeleton);
    }
    response.json(body);
  }

}


export type DictionarySearchBody = MayError<Array<SlimeWordSkeleton>>;
export type DictionaryInfoBody = MayError<SlimeDictionarySkeleton>;
export type DictionaryListBody = Array<SlimeDictionarySkeleton>;