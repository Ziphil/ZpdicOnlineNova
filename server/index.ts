//

import sendgrid from "@sendgrid/mail";
import * as typegoose from "@typegoose/typegoose";
import * as parser from "body-parser";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import express from "express";
import {
  Express,
  NextFunction,
  Request,
  Response
} from "express";
import fs from "fs";
import mongoose from "mongoose";
import {
  SchemaTypes
} from "mongoose";
import multer from "multer";
import {
  DebugController,
  DictionaryController,
  NotificationController,
  OtherController,
  UserController
} from "/server/controller/interface";
import {
  LogUtil
} from "/server/util/log";


dotenv.config({path: "./variable.env"});

export const PORT = process.env["PORT"] || 8050;
export const MONGO_URI = process.env["DB_URI"] || "mongodb://localhost:27017/zpdic";
export const COOKIE_SECRET = process.env["COOKIE_SECRET"] || "cookie-zpdic";
export const SESSION_SECRET = process.env["SESSION_SECRET"] || "session-zpdic";
export const JWT_SECRET = process.env["JWT_SECRET"] || "jwt-secret";
export const SENDGRID_KEY = process.env["SENDGRID_KEY"] || "dummy";
export const RECAPTCHA_SECRET = process.env["RECAPTCHA_SECRET"] || "dummy";


export class Main {

  private application: Express;

  public constructor() {
    this.application = express();
  }

  public main(): void {
    this.setupBodyParsers();
    this.setupCookie();
    this.setupMulter();
    this.setupMongo();
    this.setupSendgrid();
    this.setupDirectories();
    this.setupRouters();
    this.setupStatic();
    this.setupFallback();
    this.setupErrorHandler();
    this.listen();
  }

  // リクエストボディをパースするミドルウェアの設定をします。
  private setupBodyParsers(): void {
    let urlencodedParser = parser.urlencoded({extended: false});
    let jsonParser = parser.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private setupCookie(): void {
    let middleware = cookieParser(COOKIE_SECRET);
    this.application.use(middleware);
  }

  // ファイルをアップロードする処理を行う Multer の設定をします。
  // アップロードされたファイルは upload フォルダ内に保存するようにしています。
  private setupMulter(): void {
    let middleware = multer({dest: "./file/upload/"}).single("file");
    this.application.use(middleware);
  }

  // MongoDB との接続を扱う mongoose とそのモデルを自動で生成する typegoose の設定を行います。
  // typegoose のデフォルトでは、空文字列を入れると値が存在しないと解釈されてしまうので、空文字列も受け入れるようにしています。
  private setupMongo(): void {
    let check = function (value: string): boolean {
      return value !== null;
    };
    let SchemaString = SchemaTypes.String as any;
    SchemaString.checkRequired(check);
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupSendgrid(): void {
    sendgrid.setApiKey(SENDGRID_KEY);
  }

  // 内部処理で用いるディレクトリを用意します。
  private setupDirectories(): void {
    fs.mkdirSync("./file/download");
    fs.mkdirSync("./file/icon");
  }

  // ルーターの設定を行います。
  // このメソッドは、各種ミドルウェアの設定メソッドを全て呼んだ後に実行してください。
  private setupRouters(): void {
    DebugController.use(this.application);
    DictionaryController.use(this.application);
    NotificationController.use(this.application);
    OtherController.use(this.application);
    UserController.use(this.application);
  }

  private setupStatic(): void {
    this.application.use("/client", express.static(process.cwd() + "/dist/client"));
    this.application.use("/static", express.static(process.cwd() + "/dist/static"));
  }

  // ルート以外にアクセスしたときのフォールバックの設定をします。
  private setupFallback(): void {
    this.application.use("/api*", (request, response, next) => {
      let fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
      LogUtil.log("index", `not found: ${fullUrl}`);
      response.status(404).end();
    });
    this.application.use("*", (request, response, next) => {
      if ((request.method === "GET" || request.method === "HEAD") && request.accepts("html")) {
        response.sendFile(process.cwd() + "/dist/client/index.html", (error) => {
          if (error) {
            next(error);
          }
        });
      } else {
        next();
      }
    });
  }

  private setupErrorHandler(): void {
    let handler = function (error: any, request: Request, response: Response, next: NextFunction): void {
      LogUtil.error("index", "uncaught error occurred", error);
      response.status(500).end();
    };
    this.application.use(handler);
  }

  private listen(): void {
    this.application.listen(+PORT, () => {
      LogUtil.log("index", `listening on port ${PORT}`);
    });
  }

}


let main = new Main();
main.main();