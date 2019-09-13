//

import * as parser from "body-parser";
import * as express from "express";
import {
  Express
} from "express";
import * as session from "express-session";
import * as mongoose from "mongoose";
import {
  Schema
} from "mongoose";
import * as multer from "multer";
import * as passport from "passport";
import {
  IStrategyOptions,
  Strategy as LocalStrategy
} from "passport-local";
import {
  DictionaryController
} from "./controller/dictionary";
import {
  UserController
} from "./controller/user";
import {
  UserDocument,
  UserModel
} from "./model/user";


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
    this.setupPassport();
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

  // 認証を行うミドルウェアである Passport の設定を行います。
  // あらかじめセッションの設定をしておく必要があるため、setupSession メソッドより後に実行してください。
  private setupPassport(): void {
    let options = {usernameField: "name", passReqToCallback: false};
    let strategy = new LocalStrategy(<IStrategyOptions>options, async (name, password, done) => {
      let user = await UserModel.authenticate(name, password);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
    passport.use(strategy);
    passport.serializeUser<UserDocument, string>((user, done) => {
      done(null, user.id);
    });
    passport.deserializeUser<UserDocument, string>(async (id, done) => {
      try {
        let user = await UserModel.findById(id);
        done(null, user || undefined);
      } catch (error) {
        done(error);
      }
    });
    this.application.use(passport.initialize());
    this.application.use(passport.session());
  }

  private setupMongo(): void {
    let SchemaString = <any>Schema.Types.String;
    let check = function (value: string): boolean {
      return value !== null;
    };
    SchemaString.checkRequired(check);
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