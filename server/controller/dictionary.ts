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
  DictionaryAuthorityUtil,
  DictionaryCreator,
  DictionaryModel,
  WordCreator,
  WordModel
} from "/server/model/dictionary";
import {
  InvitationCreator,
  InvitationModel
} from "/server/model/invitation";
import {
  NormalSearchParameter,
  SearchModeUtil,
  SearchTypeUtil
} from "/server/model/search-parameter";
import {
  UserCreator,
  UserModel
} from "/server/model/user";
import {
  DetailedDictionary,
  UserDictionary
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
    Controller.response(response, body);
  }

  @post(SERVER_PATH["uploadDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"uploadDictionary">, response: PostResponse<"uploadDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    let path = request.file.path;
    let originalPath = request.file.originalname;
    if (dictionary) {
      let promise = new Promise(async (resolve, reject) => {
        try {
          await dictionary!.upload(path, originalPath);
          await fs.unlink(path);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      let body = DictionaryCreator.create(dictionary);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["deleteDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"deleteDictionary">, response: PostResponse<"deleteDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.removeWhole();
      Controller.response(response, null);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["changeDictionaryName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"changeDictionaryName">, response: PostResponse<"changeDictionaryName">): Promise<void> {
    let dictionary = request.dictionary;
    let name = CastUtil.ensureString(request.body.name);
    if (dictionary) {
      await dictionary.changeName(name);
      let body = DictionaryCreator.create(dictionary);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["changeDictionaryParamName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"changeDictionaryParamName">, response: PostResponse<"changeDictionaryParamName">): Promise<void> {
    let dictionary = request.dictionary;
    let paramName = CastUtil.ensureString(request.body.paramName);
    if (dictionary) {
      try {
        await dictionary.changeParamName(paramName);
        let body = DictionaryCreator.create(dictionary);
        Controller.response(response, body);
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
        Controller.responseError(response, body, error);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["inviteEditDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"inviteEditDictionary">, response: PostResponse<"inviteEditDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    let userName = CastUtil.ensureString(request.body.userName);
    let user = await UserModel.findOneByName(userName);
    if (dictionary && user) {
      try {
        let invitation = await InvitationModel.createEdit(dictionary, user);
        let body = await InvitationCreator.create(invitation);
        Controller.response(response, body);
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
        Controller.responseError(response, body, error);
      }
    } else {
      let body = (() => {
        if (dictionary === undefined) {
          return CustomError.ofType("noSuchDictionaryNumber");
        } else {
          return CustomError.ofType("noSuchUser");
        }
      })();
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["respondEditDictionary"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"respondEditDictionary">, response: PostResponse<"respondEditDictionary">): Promise<void> {
    let user = request.user!;
    let id = CastUtil.ensureString(request.body.id);
    let accept = CastUtil.ensureBoolean(request.body.accept);
    let invitation = await InvitationModel.findById(id);
    if (invitation) {
      try {
        invitation.respond(user, accept);
        let body = await InvitationCreator.create(invitation);
        Controller.response(response, body);
      } catch (error) {
        if (error.name === "CustomError" && error.type === "forbidden") {
          Controller.responseForbidden(response);
        } else {
          throw error;
        }
      }
    } else {
      let body = CustomError.ofType("noSuchInvitation");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["changeDictionarySecret"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"changeDictionarySecret">, response: PostResponse<"changeDictionarySecret">): Promise<void> {
    let dictionary = request.dictionary;
    let secret = CastUtil.ensureBoolean(request.body.secret);
    if (dictionary) {
      await dictionary.changeSecret(secret);
      let body = DictionaryCreator.create(dictionary);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["changeDictionaryExplanation"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"changeDictionaryExplanation">, response: PostResponse<"changeDictionaryExplanation">): Promise<void> {
    let dictionary = request.dictionary;
    let explanation = CastUtil.ensureString(request.body.explanation);
    if (dictionary) {
      await dictionary.changeExplanation(explanation);
      let body = DictionaryCreator.create(dictionary);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["editWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: PostRequest<"editWord">, response: PostResponse<"editWord">): Promise<void> {
    let dictionary = request.dictionary;
    let word = request.body.word;
    if (dictionary) {
      let resultWord = await dictionary.editWord(word);
      let body = WordCreator.create(resultWord);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @post(SERVER_PATH["deleteWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: PostRequest<"deleteWord">, response: PostResponse<"deleteWord">): Promise<void> {
    let dictionary = request.dictionary;
    let wordNumber = request.body.wordNumber;
    if (dictionary) {
      try {
        let resultWord = await dictionary.deleteWord(wordNumber);
        let body = WordCreator.create(resultWord);
        Controller.response(response, body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError" && error.type === "noSuchWordNumber") {
            return CustomError.ofType("noSuchWordNumber");
          }
        })();
        Controller.responseError(response, body, error);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
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
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
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
      Controller.responseError(response, body);
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
        Controller.response(response, body);
      } else {
        let body = (() => {
          if (number !== undefined) {
            return CustomError.ofType("noSuchDictionaryNumber");
          } else {
            return CustomError.ofType("noSuchDictionaryParamName");
          }
        })();
        Controller.responseError(response, body);
      }
    } else {
      let body = CustomError.ofType("invalidArgument");
      Controller.responseError(response, body);
    }
  }

  @get(SERVER_PATH["fetchDictionaryAuthorizedUsers"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: GetRequest<"fetchDictionaryAuthorizedUsers">, response: GetResponse<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    let dictionary = request.dictionary;
    let authority = DictionaryAuthorityUtil.cast(CastUtil.ensureString(request.query.authority));
    if (dictionary) {
      let users = await dictionary.getAuthorizedUsers(authority);
      let body = users.map(UserCreator.create);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @get(SERVER_PATH["fetchWholeDictionary"])
  public async [Symbol()](request: GetRequest<"fetchWholeDictionary">, response: GetResponse<"fetchWholeDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let body = await DictionaryCreator.createDetailed(dictionary);
      Controller.response(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

  @get(SERVER_PATH["fetchDictionaries"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchDictionaries">, response: GetResponse<"fetchDictionaries">): Promise<void> {
    let user = request.user!;
    let dictionaries = await DictionaryModel.findByUser(user, "edit");
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<UserDictionary>(async (resolve, reject) => {
        try {
          let skeleton = await DictionaryCreator.createUser(dictionary, user);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    Controller.response(response, body);
  }

  @get(SERVER_PATH["fetchAllDictionaries"])
  public async [Symbol()](request: GetRequest<"fetchAllDictionaries">, response: GetResponse<"fetchAllDictionaries">): Promise<void> {
    let dictionaries = await DictionaryModel.findPublic();
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<DetailedDictionary>(async (resolve, reject) => {
        try {
          let skeleton = await DictionaryCreator.createDetailed(dictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    Controller.response(response, body);
  }

  @get(SERVER_PATH["fetchDictionaryAggregation"])
  public async [Symbol()](request: GetRequest<"fetchDictionaryAggregation">, response: GetResponse<"fetchDictionaryAggregation">): Promise<void> {
    let dictionarySize = await DictionaryModel.find().estimatedDocumentCount();
    let wordSize = await WordModel.find().estimatedDocumentCount();
    let body = {dictionarySize, wordSize};
    Controller.response(response, body);
  }

  @get(SERVER_PATH["fetchInvitations"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchInvitations">, response: GetResponse<"fetchInvitations">): Promise<void> {
    let user = request.user!;
    let type = CastUtil.ensureString(request.query.type);
    let invitations = await InvitationModel.findByUser(type, user);
    let body = await Promise.all(invitations.map((invitation) => InvitationCreator.create(invitation)));
    Controller.response(response, body);
  }

  @get(SERVER_PATH["checkDictionaryAuthorization"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"checkDictionaryAuthorization">, response: GetResponse<"checkDictionaryAuthorization">): Promise<void> {
    let user = request.user!;
    let number = CastUtil.ensureNumber(request.query.number);
    let authority = DictionaryAuthorityUtil.cast(CastUtil.ensureString(request.query.authority));
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let hasAuthority = await dictionary.hasAuthority(user, authority);
      if (hasAuthority) {
        Controller.response(response, null);
      } else {
        Controller.responseForbidden(response);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.responseError(response, body);
    }
  }

}