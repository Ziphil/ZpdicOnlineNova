//

import sendgrid from "@sendgrid/mail";
import * as typegoose from "@typegoose/typegoose";
import aws from "aws-sdk";
import cookieParser from "cookie-parser";
import express from "express";
import {
  Express,
  NextFunction,
  Request,
  Response
} from "express";
import fs from "fs";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import {
  CommissionController,
  DebugController,
  DictionaryController,
  ExampleController,
  HistoryController,
  InvitationController,
  NotificationController,
  OtherController,
  ResourceController,
  UserController,
  WordController
} from "/server/controller/internal";
import {
  LogUtil
} from "/server/util/log";
import {
  MongoUtil
} from "/server/util/mongo";
import {
  AWS_KEY,
  AWS_REGION,
  AWS_SECRET,
  COOKIE_SECRET,
  MONGO_URI,
  PORT,
  SENDGRID_KEY
} from "/server/variable";


export class Main {

  private application!: Express;

  public main(): void {
    this.application = express();
    this.setupBodyParsers();
    this.setupCookie();
    this.setupMulter();
    this.setupMorgan();
    this.setupMongo();
    this.setupSendgrid();
    this.setupAws();
    this.setupDirectories();
    this.setupRouters();
    this.setupStatic();
    this.setupFallbackHandlers();
    this.setupErrorHandler();
    this.listen();
  }

  // リクエストボディをパースするミドルウェアの設定をします。
  private setupBodyParsers(): void {
    let urlencodedParser = express.urlencoded({extended: false});
    let jsonParser = express.json();
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
    let middleware = multer({dest: "./dist/upload/"}).single("file");
    this.application.use("/internal*", middleware);
  }

  // アクセスログを出力する morgan の設定をします。
  private setupMorgan(): void {
    let middleware = morgan<Request>((tokens, request, response) => {
      let method = tokens.method(request, response);
      let status = tokens.status(request, response);
      let url = tokens.url(request, response);
      let time = tokens["total-time"](request, response, 0);
      let body = ("password" in request.body) ? {...request.body, password: "***"} : request.body;
      let bodyString = JSON.stringify(body);
      return `![request] ${method} ${status} ${url} | time: ${time}ms | body: ${bodyString}`;
    });
    this.application.use(middleware);
  }

  // MongoDB との接続を扱う mongoose とそのモデルを自動で生成する typegoose の設定を行います。
  // typegoose のデフォルトでは、空文字列を入れると値が存在しないと解釈されてしまうので、空文字列も受け入れるようにしています。
  private setupMongo(): void {
    MongoUtil.setCheckRequired("String");
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupSendgrid(): void {
    sendgrid.setApiKey(SENDGRID_KEY);
  }

  private setupAws(): void {
    let credentials = {accessKeyId: AWS_KEY, secretAccessKey: AWS_SECRET};
    let region = AWS_REGION;
    aws.config.update({credentials, region});
  }

  // 内部処理で用いるディレクトリを用意します。
  private setupDirectories(): void {
    fs.mkdirSync("./dist/download", {recursive: true});
  }

  // ルーターの設定を行います。
  // このメソッドは、各種ミドルウェアの設定メソッドを全て呼んだ後に実行してください。
  private setupRouters(): void {
    CommissionController.use(this.application);
    DebugController.use(this.application);
    DictionaryController.use(this.application);
    ExampleController.use(this.application);
    HistoryController.use(this.application);
    InvitationController.use(this.application);
    NotificationController.use(this.application);
    OtherController.use(this.application);
    ResourceController.use(this.application);
    UserController.use(this.application);
    WordController.use(this.application);
  }

  private setupStatic(): void {
    this.application.use("/client", express.static(process.cwd() + "/dist/client"));
    this.application.use("/static", express.static(process.cwd() + "/dist/static"));
  }

  // ルーターで設定されていない URL にアクセスされたときのフォールバックの設定をします。
  // フロントエンドから呼び出すためのエンドポイント用 URL で処理が存在しないものにアクセスされた場合は、404 エラーを返します。
  // そうでない場合は、フロントエンドのトップページを返します。
  private setupFallbackHandlers(): void {
    let internalHandler = function (request: Request, response: Response, next: NextFunction): void {
      let fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
      response.status(404).end();
    };
    let otherHandler = function (request: Request, response: Response, next: NextFunction): void {
      let method = request.method;
      if ((method === "GET" || method === "HEAD") && request.accepts("html")) {
        response.sendFile(process.cwd() + "/dist/client/index.html", (error) => {
          if (error) {
            next(error);
          }
        });
      } else {
        next();
      }
    };
    this.application.use("/internal*", internalHandler);
    this.application.use("*", otherHandler);
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
      LogUtil.log("index", `listening | port: ${PORT}`);
    });
  }

}


let main = new Main();
main.main();