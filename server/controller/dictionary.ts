//

import {
  Controller,
  Request,
  Response
} from "/server/controller/controller";
import {
  verifyToken
} from "/server/controller/middle";
import {
  SERVER_PATH
} from "/server/controller/type";
import {
  SlimeDictionaryModel,
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/model/dictionary/slime";
import {
  CustomErrorSkeleton
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


@controller("/")
export class DictionaryController extends Controller {

  @post(SERVER_PATH["dictionaryUpload"])
  public async postUpload(request: Request<"dictionaryUpload">, response: Response<"dictionaryUpload">): Promise<void> {
    let user = await UserModel.findOne({name: "Test"}).exec();
    if (user) {
      SlimeDictionaryModel.registerUpload("テスト辞書", user, request.file.path);
      response.send("Uploaded");
    } else {
      response.send("User not found");
    }
  }

  @get(SERVER_PATH["dictionarySearch"])
  public async getSearch(request: Request<"dictionarySearch">, response: Response<"dictionarySearch">): Promise<void> {
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

  @get(SERVER_PATH["dictionaryInfo"])
  public async getInfo(request: Request<"dictionaryInfo">, response: Response<"dictionaryInfo">): Promise<void> {
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

  @get(SERVER_PATH["dictionaryList"])
  @before(verifyToken())
  public async getList(request: Request<"dictionaryList">, response: Response<"dictionaryList">): Promise<void> {
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