//

import * as parser from "body-parser";
import * as express from "express";
import {
  Express
} from "express";
import * as session from "express-session";
import * as mongoose from "mongoose";
import * as multer from "multer";
import {
  DictionaryController
} from "./controller/dictionary";
import {
  UserController
} from "./controller/user";


const PORT = 3000;
const HOSTNAME = "localhost";

const MONGO_URI = "mongodb://localhost:27017/zpdic";


class Main {

  private application: Express;

  public constructor() {
    this.application = express();
  }

  public main(): void {
    this.setupParsers();
    this.setupMulter();
    this.setupRenderer();
    this.setupSession();
    this.setupMongo();
    this.setupRouters();
    this.listen();
  }

  private setupParsers(): void {
    let urlencodedParser = parser.urlencoded({extended: false});
    let jsonParser = parser.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private setupMulter(): void {
    let middleware = multer({dest: "./upload/"}).single("file");
    this.application.use(middleware);
  }

  private setupRenderer(): void {
    this.application.set("views", process.cwd() + "/source/view");
    this.application.set("view engine", "ejs");
  }

  private setupSession(): void {
    let middleware = session({
      secret: "zpdic",
      resave: false,
      saveUninitialized: false,
      cookie: {maxAge: 60 * 60 * 1000}
    });
    this.application.use(middleware);
  }

  private setupMongo(): void {
    mongoose.connect(MONGO_URI);
  }

  private setupRouters(): void {
    UserController.use(this.application);
    DictionaryController.use(this.application);
  }

  private listen(): void {
    this.application.listen(PORT, HOSTNAME, () => {
      console.log("Listening on port " + PORT);
    });
  }

}


let main = new Main();
main.main();