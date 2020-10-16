//

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
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/interface/type";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
import {
  WordCreator
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/skeleton/error";


@controller(SERVER_PATH_PREFIX)
export class WordController extends Controller {

  @post(SERVER_PATHS["editWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: PostRequest<"editWord">, response: PostResponse<"editWord">): Promise<void> {
    let dictionary = request.dictionary;
    let word = request.body.word;
    if (dictionary) {
      let resultWord = await dictionary.editWord(word);
      let body = WordCreator.create(resultWord);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["deleteWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: PostRequest<"deleteWord">, response: PostResponse<"deleteWord">): Promise<void> {
    let dictionary = request.dictionary;
    let wordNumber = request.body.wordNumber;
    if (dictionary) {
      try {
        let resultWord = await dictionary.deleteWord(wordNumber);
        let body = WordCreator.create(resultWord);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError" && error.type === "noSuchWordNumber") {
            return CustomError.ofType("noSuchWordNumber");
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}