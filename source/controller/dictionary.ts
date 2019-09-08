//

import {
  NextFunction,
  Request,
  Response
} from "express";
import {
  SlimeDictionaryModel,
  SlimeWordModel
} from "../model/slime-dictionary";
import {
  UserModel
} from "../model/user";
import {
  Controller
} from "./util/class";
import {
  before,
  controller,
  get,
  post
} from "./util/decorator";



@controller("/dictionary")
export class DictionaryController extends Controller {

  @get("/upload")
  private getUpload(request: Request, response: Response): void {
    response.render("upload.ejs");
  }

  @post("/upload")
  private postUpload(request: Request, response: Response): void {
    console.log(request.file.path);
    response.send("Uploaded");
  }

  @get("/debug")
  private async getDebug(request: Request, response: Response): Promise<void> {
    let user = await UserModel.findOne({name: "Test"}).exec();
    if (user) {
      console.log("User found");
      console.log("Creating a dictionary");
      let dictionary = new SlimeDictionaryModel({});
      dictionary.number = 1;
      dictionary.status = "ready";
      dictionary.name = "Test";
      dictionary.user = user;
      dictionary.externalData = {};
      console.log("Creating a word");
      let word = new SlimeWordModel({});
      word.dictionary = dictionary;
      word.number = 2;
      word.name = "foo";
      word.equivalents = [{title: "名詞", names: ["あいう", "かきく"]}, {title: "形容詞", names: ["もふ"]}];
      word.tags = ["タグ", "タグタグ"];
      word.informations = [{title: "用例", text: "よく分からない"}];
      word.variations = [{title: "変化型", name: "foooo"}];
      word.relations = [{title: "対義語", number: 2, name: "foo"}];
      console.log("Saving the dictionary");
      await dictionary.save();
      console.log("Saving the word");
      await word.save();
    }
    response.send("Debugging");
  }

}