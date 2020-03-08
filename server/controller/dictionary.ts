//

import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  verifyDictionary,
  verifyUser
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
  before,
  controller,
  get,
  post
} from "/server/util/decorator";


@controller("/")
export class DictionaryController extends Controller {

  @post(SERVER_PATH["createDictionary"])
  @before(verifyUser())
  public async postCreateDictionary(request: PostRequest<"createDictionary">, response: PostResponse<"createDictionary">): Promise<void> {
    let user = request.user!;
    let name = request.body.name;
    let dictionary = await SlimeDictionaryModel.createEmpty(name, user);
    let body = new SlimeDictionarySkeleton(dictionary);
    response.json(body);
  }

  @post(SERVER_PATH["uploadDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async postUploadDictionary(request: PostRequest<"uploadDictionary">, response: PostResponse<"uploadDictionary">): Promise<void> {
    let dictionary = request.dictionary!;
    let path = request.file.path;
    let nextDictionary = await dictionary.upload(path);
    let body = new SlimeDictionarySkeleton(nextDictionary);
    response.json(body);
  }

  @post(SERVER_PATH["renameDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async postRenameDictionary(request: PostRequest<"renameDictionary">, response: PostResponse<"renameDictionary">): Promise<void> {
    let dictionary = request.dictionary!;
    let name = request.body.name;
    let nextDictionary = await dictionary.rename(name);
    let body = new SlimeDictionarySkeleton(nextDictionary);
    response.json(body);
  }

  @get(SERVER_PATH["searchDictionary"])
  public async getSearchDictionary(request: GetRequest<"searchDictionary">, response: GetResponse<"searchDictionary">): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let search = request.query.search;
    let mode = request.query.mode;
    let type = request.query.type;
    let offset = parseInt(request.query.offset, 10) || 0;
    let size = parseInt(request.query.size, 10) || 0;
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let words = await dictionary.search(search, mode, type, offset, size);
      let body = words.map((word) => new SlimeWordSkeleton(word));
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchDictionaryInfo"])
  public async getFetchDictionaryInfo(request: GetRequest<"fetchDictionaryInfo">, response: GetResponse<"fetchDictionaryInfo">): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let body = new SlimeDictionarySkeleton(dictionary);
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchDictionaries"])
  @before(verifyUser())
  public async getFetchDictionaries(request: GetRequest<"fetchDictionaries">, response: GetResponse<"fetchDictionaries">): Promise<void> {
    let user = request.user!;
    let dictionaries = await SlimeDictionaryModel.findByUser(user);
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<SlimeDictionarySkeleton>(async (resolve, reject) => {
        try {
          let skeleton = new SlimeDictionarySkeleton(dictionary);
          await skeleton.fetch(dictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    response.json(body);
  }

  @get(SERVER_PATH["fetchAllDictionaries"])
  public async getFetchAllDictionaries(request: GetRequest<"fetchAllDictionaries">, response: GetResponse<"fetchAllDictionaries">): Promise<void> {
    let dictionaries = await SlimeDictionaryModel.findPublic();
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<SlimeDictionarySkeleton>(async (resolve, reject) => {
        try {
          let skeleton = new SlimeDictionarySkeleton(dictionary);
          await skeleton.fetch(dictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    response.json(body);
  }

}