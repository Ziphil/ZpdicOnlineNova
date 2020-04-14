//

import {
  promises as fs
} from "fs";
import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  before,
  controller,
  get,
  post
} from "/server/controller/decorator";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
import {
  SERVER_PATH
} from "/server/controller/type";
import {
  NormalSearchParameter,
  SearchModeUtil,
  SearchTypeUtil
} from "/server/model/dictionary/search-parameter";
import {
  SlimeDictionaryModel,
  SlimeWordModel
} from "/server/model/dictionary/slime";
import {
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";
import {
  CustomErrorSkeleton
} from "/server/skeleton/error";
import {
  CastUtil
} from "/server/util/cast";


@controller("/")
export class DictionaryController extends Controller {

  @post(SERVER_PATH["createDictionary"])
  @before(verifyUser())
  public async postCreateDictionary(request: PostRequest<"createDictionary">, response: PostResponse<"createDictionary">): Promise<void> {
    let user = request.user!;
    let name = CastUtil.ensureString(request.body.name);
    let dictionary = await SlimeDictionaryModel.createEmpty(name, user);
    let body = SlimeDictionarySkeleton.from(dictionary);
    response.json(body);
  }

  @post(SERVER_PATH["uploadDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async postUploadDictionary(request: PostRequest<"uploadDictionary">, response: PostResponse<"uploadDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    let path = request.file.path;
    if (dictionary) {
      let promise = new Promise(async (resolve, reject) => {
        try {
          await dictionary!.upload(path);
          await fs.unlink(path);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      let body = SlimeDictionarySkeleton.from(dictionary);
      response.json(body);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["deleteDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async postDeleteDictionary(request: PostRequest<"deleteDictionary">, response: PostResponse<"deleteDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.removeWhole();
      response.json(true);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionaryName"])
  @before(verifyUser(), verifyDictionary())
  public async postChangeDictionaryName(request: PostRequest<"changeDictionaryName">, response: PostResponse<"changeDictionaryName">): Promise<void> {
    let dictionary = request.dictionary;
    let name = CastUtil.ensureString(request.body.name);
    if (dictionary) {
      await dictionary.changeName(name);
      let body = SlimeDictionarySkeleton.from(dictionary);
      response.json(body);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionaryParamName"])
  @before(verifyUser(), verifyDictionary())
  public async postChangeDictionaryParamName(request: PostRequest<"changeDictionaryParamName">, response: PostResponse<"changeDictionaryParamName">): Promise<void> {
    let dictionary = request.dictionary;
    let paramName = CastUtil.ensureString(request.body.paramName);
    if (dictionary) {
      try {
        await dictionary.changeParamName(paramName);
        let body = SlimeDictionarySkeleton.from(dictionary);
        response.json(body);
      } catch (error) {
        let body;
        if (error.name === "CustomError") {
          if (error.type === "duplicateDictionaryParamName") {
            body = CustomErrorSkeleton.ofType("duplicateDictionaryParamName");
          }
        } else if (error.name === "ValidationError") {
          if (error.errors.paramName) {
            body = CustomErrorSkeleton.ofType("invalidDictionaryParamName");
          }
        }
        if (body) {
          response.status(400).json(body);
        } else {
          throw error;
        }
      }
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionarySecret"])
  @before(verifyUser(), verifyDictionary())
  public async postChangeDictionarySecret(request: PostRequest<"changeDictionarySecret">, response: PostResponse<"changeDictionarySecret">): Promise<void> {
    let dictionary = request.dictionary;
    let secret = CastUtil.ensureBoolean(request.body.secret);
    if (dictionary) {
      await dictionary.changeSecret(secret);
      let body = SlimeDictionarySkeleton.from(dictionary);
      response.json(body);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionaryExplanation"])
  @before(verifyUser(), verifyDictionary())
  public async postChangeDictionaryExplanation(request: PostRequest<"changeDictionaryExplanation">, response: PostResponse<"changeDictionaryExplanation">): Promise<void> {
    let dictionary = request.dictionary;
    let explanation = CastUtil.ensureString(request.body.explanation);
    if (dictionary) {
      await dictionary.changeExplanation(explanation);
      let body = SlimeDictionarySkeleton.from(dictionary);
      response.json(body);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["searchDictionary"])
  public async getSearchDictionary(request: GetRequest<"searchDictionary">, response: GetResponse<"searchDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let search = CastUtil.ensureString(request.query.search);
    let mode = SearchModeUtil.cast(CastUtil.ensureString(request.query.mode));
    let type = SearchTypeUtil.cast(CastUtil.ensureString(request.query.type));
    let offset = CastUtil.ensureNumber(request.query.offset);
    let size = CastUtil.ensureNumber(request.query.size);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let parameter = new NormalSearchParameter(search, mode, type);
      let result = await dictionary.search(parameter, offset, size);
      let hitSize = result.hitSize;
      let hitWordsBody = result.hitWords.map(SlimeWordSkeleton.from);
      let body = {hitSize, hitWords: hitWordsBody};
      response.json(body);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["downloadDictionary"])
  public async getDownloadDictionary(request: GetRequest<"downloadDictionary">, response: GetResponse<"downloadDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let fileName = CastUtil.ensureString(request.query.fileName);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let path = "./upload/download.json";
      let fullFileName = (fileName || "dictionary") + ".json";
      await dictionary.download(path);
      response.download(path, fullFileName);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchDictionary"])
  public async getFetchDictionary(request: GetRequest<"fetchDictionary">, response: GetResponse<"fetchDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let paramName = CastUtil.ensureString(request.query.paramName);
    let value = number ?? paramName;
    if (value !== undefined) {
      let dictionary = await SlimeDictionaryModel.findOneByValue(value);
      if (dictionary) {
        let body = SlimeDictionarySkeleton.from(dictionary);
        response.json(body);
      } else {
        let body;
        if (number !== undefined) {
          body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
        } else {
          body = CustomErrorSkeleton.ofType("invalidDictionaryParamName");
        }
        response.status(400).json(body);
      }
    } else {
      let body = CustomErrorSkeleton.ofType("invalidArgument");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchWholeDictionary"])
  public async getFetchWholeDictionary(request: GetRequest<"fetchWholeDictionary">, response: GetResponse<"fetchWholeDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let body = await SlimeDictionarySkeleton.fromFetch(dictionary, true);
      response.json(body);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
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
          let skeleton = await SlimeDictionarySkeleton.fromFetch(dictionary, false);
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
          let skeleton = await SlimeDictionarySkeleton.fromFetch(dictionary, false);
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

  @get(SERVER_PATH["fetchDictionaryAggregation"])
  public async getFetchDictionaryAggregation(request: GetRequest<"fetchDictionaryAggregation">, response: GetResponse<"fetchDictionaryAggregation">): Promise<void> {
    let dictionarySize = await SlimeDictionaryModel.find().countDocuments();
    let wordSize = await SlimeWordModel.find().countDocuments();
    let body = {dictionarySize, wordSize};
    response.json(body);
  }

  @get(SERVER_PATH["checkDictionaryAuthorization"])
  @before(verifyUser(), verifyDictionary())
  public async getCheckDictionaryAuthorization(request: GetRequest<"checkDictionaryAuthorization">, response: GetResponse<"checkDictionaryAuthorization">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      response.json(true);
    } else {
      let body = CustomErrorSkeleton.ofType("invalidDictionaryNumber");
      response.status(400).json(body);
    }
  }

}