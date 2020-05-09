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
  AccessInvitationModel
} from "/server/model/access-invitation";
import {
  DictionaryCreator,
  DictionaryModel,
  WordCreator,
  WordModel
} from "/server/model/dictionary";
import {
  NormalSearchParameter,
  SearchModeUtil,
  SearchTypeUtil
} from "/server/model/search-parameter";
import {
  UserModel
} from "/server/model/user";
import {
  Dictionary
} from "/server/skeleton/dictionary";
import {
  CustomError
} from "/server/skeleton/error";
import {
  CastUtil
} from "/server/util/cast";


@controller("/")
export class DictionaryController extends Controller {

  @post(SERVER_PATH["createDictionary"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"createDictionary">, response: PostResponse<"createDictionary">): Promise<void> {
    let user = request.user!;
    let name = CastUtil.ensureString(request.body.name);
    let dictionary = await DictionaryModel.createEmpty(name, user);
    let body = DictionaryCreator.create(dictionary);
    response.json(body);
  }

  @post(SERVER_PATH["uploadDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"uploadDictionary">, response: PostResponse<"uploadDictionary">): Promise<void> {
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
      let body = DictionaryCreator.create(dictionary);
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["deleteDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"deleteDictionary">, response: PostResponse<"deleteDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.removeWhole();
      response.json({});
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionaryName"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"changeDictionaryName">, response: PostResponse<"changeDictionaryName">): Promise<void> {
    let dictionary = request.dictionary;
    let name = CastUtil.ensureString(request.body.name);
    if (dictionary) {
      await dictionary.changeName(name);
      let body = DictionaryCreator.create(dictionary);
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionaryParamName"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"changeDictionaryParamName">, response: PostResponse<"changeDictionaryParamName">): Promise<void> {
    let dictionary = request.dictionary;
    let paramName = CastUtil.ensureString(request.body.paramName);
    if (dictionary) {
      try {
        await dictionary.changeParamName(paramName);
        let body = DictionaryCreator.create(dictionary);
        response.json(body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError") {
            if (error.type === "duplicateDictionaryParamName") {
              return CustomError.ofType("duplicateDictionaryParamName");
            }
          } else if (error.name === "ValidationError") {
            if (error.errors.paramName) {
              return CustomError.ofType("invalidDictionaryParamName");
            }
          }
        })();
        if (body) {
          response.status(400).json(body);
        } else {
          throw error;
        }
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["inviteEditDictionary"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"inviteEditDictionary">, response: PostResponse<"inviteEditDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    let userName = CastUtil.ensureString(request.body.userName);
    let user = await UserModel.findOneByName(userName);
    if (dictionary && user) {
      try {
        let invitation = await AccessInvitationModel.createEdit(dictionary, user);
        response.json({});
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError") {
            if (error.type === "userCanAlreadyEdit") {
              return CustomError.ofType("userCanAlreadyEdit");
            } else if (error.type === "editDictionaryAlreadyInvited") {
              return CustomError.ofType("editDictionaryAlreadyInvited");
            }
          }
        })();
        if (body) {
          response.status(400).json(body);
        } else {
          throw error;
        }
      }
    } else {
      let body = (() => {
        if (dictionary === undefined) {
          return CustomError.ofType("noSuchDictionaryNumber");
        } else {
          return CustomError.ofType("noSuchUser");
        }
      })();
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionarySecret"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"changeDictionarySecret">, response: PostResponse<"changeDictionarySecret">): Promise<void> {
    let dictionary = request.dictionary;
    let secret = CastUtil.ensureBoolean(request.body.secret);
    if (dictionary) {
      await dictionary.changeSecret(secret);
      let body = DictionaryCreator.create(dictionary);
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["changeDictionaryExplanation"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"changeDictionaryExplanation">, response: PostResponse<"changeDictionaryExplanation">): Promise<void> {
    let dictionary = request.dictionary;
    let explanation = CastUtil.ensureString(request.body.explanation);
    if (dictionary) {
      await dictionary.changeExplanation(explanation);
      let body = DictionaryCreator.create(dictionary);
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["editWord"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"editWord">, response: PostResponse<"editWord">): Promise<void> {
    let dictionary = request.dictionary;
    let word = request.body.word;
    if (dictionary) {
      let resultWord = await dictionary.editWord(word);
      let body = WordCreator.create(resultWord);
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @post(SERVER_PATH["deleteWord"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: PostRequest<"deleteWord">, response: PostResponse<"deleteWord">): Promise<void> {
    let dictionary = request.dictionary;
    let wordNumber = request.body.wordNumber;
    if (dictionary) {
      try {
        let resultWord = await dictionary.deleteWord(wordNumber);
        let body = WordCreator.create(resultWord);
        response.json(body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError" && error.type === "noSuchWordNumber") {
            return CustomError.ofType("noSuchWordNumber");
          }
        })();
        if (body) {
          response.status(400).json(body);
        } else {
          throw error;
        }
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["searchDictionary"])
  public async [Symbol()](request: GetRequest<"searchDictionary">, response: GetResponse<"searchDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let search = CastUtil.ensureString(request.query.search);
    let mode = SearchModeUtil.cast(CastUtil.ensureString(request.query.mode));
    let type = SearchTypeUtil.cast(CastUtil.ensureString(request.query.type));
    let offset = CastUtil.ensureNumber(request.query.offset);
    let size = CastUtil.ensureNumber(request.query.size);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let parameter = new NormalSearchParameter(search, mode, type);
      let result = await dictionary.search(parameter, offset, size);
      let hitSize = result.hitSize;
      let hitWordsBody = result.hitWords.map(WordCreator.create);
      let body = {hitSize, hitWords: hitWordsBody};
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["downloadDictionary"])
  public async [Symbol()](request: GetRequest<"downloadDictionary">, response: GetResponse<"downloadDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let fileName = CastUtil.ensureString(request.query.fileName);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let path = "./upload/download.json";
      let fullFileName = (fileName || "dictionary") + ".json";
      await dictionary.download(path);
      response.download(path, fullFileName);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchDictionary"])
  public async [Symbol()](request: GetRequest<"fetchDictionary">, response: GetResponse<"fetchDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let paramName = CastUtil.ensureString(request.query.paramName);
    let value = number ?? paramName;
    if (value !== undefined) {
      let dictionary = await DictionaryModel.findOneByValue(value);
      if (dictionary) {
        let body = DictionaryCreator.create(dictionary);
        response.json(body);
      } else {
        let body = (() => {
          if (number !== undefined) {
            return CustomError.ofType("noSuchDictionaryNumber");
          } else {
            return CustomError.ofType("noSuchDictionaryParamName");
          }
        })();
        response.status(400).json(body);
      }
    } else {
      let body = CustomError.ofType("invalidArgument");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchWholeDictionary"])
  public async [Symbol()](request: GetRequest<"fetchWholeDictionary">, response: GetResponse<"fetchWholeDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let body = await DictionaryCreator.fetch(dictionary, true);
      response.json(body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["fetchDictionaries"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchDictionaries">, response: GetResponse<"fetchDictionaries">): Promise<void> {
    let user = request.user!;
    let dictionaries = await DictionaryModel.findByUser(user);
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<Dictionary>(async (resolve, reject) => {
        try {
          let skeleton = await DictionaryCreator.fetch(dictionary, false);
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
  public async [Symbol()](request: GetRequest<"fetchAllDictionaries">, response: GetResponse<"fetchAllDictionaries">): Promise<void> {
    let dictionaries = await DictionaryModel.findPublic();
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<Dictionary>(async (resolve, reject) => {
        try {
          let skeleton = await DictionaryCreator.fetch(dictionary, false);
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
  public async [Symbol()](request: GetRequest<"fetchDictionaryAggregation">, response: GetResponse<"fetchDictionaryAggregation">): Promise<void> {
    let dictionarySize = await DictionaryModel.find().countDocuments();
    let wordSize = await WordModel.find().countDocuments();
    let body = {dictionarySize, wordSize};
    response.json(body);
  }

  @get(SERVER_PATH["checkDictionaryAuthorization"])
  @before(verifyUser(), verifyDictionary())
  public async [Symbol()](request: GetRequest<"checkDictionaryAuthorization">, response: GetResponse<"checkDictionaryAuthorization">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      response.json({});
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      response.status(400).json(body);
    }
  }

}