//

import sendgrid from "@sendgrid/mail";
import * as typegoose from "@typegoose/typegoose";
import Agenda from "agenda";
import aws from "aws-sdk";
import cookieParser from "cookie-parser";
import express from "express";
import {Express, NextFunction, Request, Response} from "express";
import fs from "fs";
import http, {Server as HttpServer} from "http";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import {Server} from "socket.io";
import {
  DictionaryJobController,
  RegularJobController
} from "/server/controller/job/internal";
import {
  CommissionRestController,
  DictionaryRestController,
  ExampleRestController,
  HistoryRestController,
  InvitationRestController,
  NotificationRestController,
  OtherRestController,
  ResourceRestController,
  UserRestController,
  WordRestController
} from "/server/controller/rest/internal";
import {
  DictionarySocketController
} from "/server/controller/socket/internal";
import {LogUtil} from "/server/util/log";
import {setMongoCheckRequired} from "/server/util/mongo";
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

  private application: Express;
  private httpServer: HttpServer;
  private server: Server;
  private agenda: Agenda;

  public constructor() {
    this.application = express();
    this.httpServer = this.createHttpServer();
    this.server = this.createSocketServer();
    this.agenda = this.createAgenda();
  }

  public main(): void {
    this.addBodyParserMiddlewares();
    this.addCookieMiddleware();
    this.addFileMiddleware();
    this.addLogMiddleware();
    this.addCustomMiddlewares();
    this.setupMongo();
    this.setupSendgrid();
    this.setupAws();
    this.setupDirectories();
    this.useRestControllers();
    this.useSocketControllers();
    this.useJobControllers();
    this.setupSchedules();
    this.addStaticHandlers();
    this.addFallbackHandlers();
    this.addErrorHandler();
    this.listen();
  }

  private createHttpServer(): HttpServer {
    const application = this.application;
    const httpServer = http.createServer(application);
    return httpServer;
  }

  private createSocketServer(): Server {
    const httpServer = this.httpServer;
    const server = new Server(httpServer, {cors: {origin: "*"}});
    return server;
  }

  private createAgenda(): Agenda {
    const agenda = new Agenda({db: {address: MONGO_URI, collection: "agenda"}});
    return agenda;
  }

  private addBodyParserMiddlewares(): void {
    const urlencodedParser = express.urlencoded({extended: false});
    const jsonParser = express.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private addCookieMiddleware(): void {
    const middleware = cookieParser(COOKIE_SECRET);
    this.application.use(middleware);
  }

  /** ファイルをアップロードする処理を行う Multer の設定をします。
   * アップロードされたファイルは upload フォルダ内に保存するようにしています。*/
  private addFileMiddleware(): void {
    const middleware = multer({dest: "./dist/upload/"}).single("file");
    this.application.use("/internal*", middleware);
  }

  private addLogMiddleware(): void {
    const middleware = morgan<Request>((tokens, request, response) => {
      const method = tokens["method"](request, response);
      const status = +tokens["status"](request, response)!;
      const url = tokens["url"](request, response);
      const baseUrl = request.baseUrl;
      const time = +tokens["total-time"](request, response, 0)!;
      const query = request.query;
      const body = ("password" in request.body) ? {...request.body, password: "***"} : request.body;
      const logString = JSON.stringify({baseUrl, url, method, status, time, query, body});
      return `!<request> ${logString}`;
    });
    this.application.use(middleware);
  }

  /** 独自ミドルウェア用に、リクエストオブジェクトに `middlewareBody` プロパティを追加します。
   * 独自ミドルウェアは、このプロパティ内に情報を格納します。*/
  private addCustomMiddlewares(): void {
    const middleware = function (request: any, response: Response, next: NextFunction): void {
      request.middlewareBody = {};
      next();
    };
    this.application.use("/internal*", middleware);
  }

  /** MongoDB との接続を扱う mongoose とそのモデルを自動で生成する typegoose の設定を行います。
   * typegoose のデフォルトでは、空文字列を入れると値が存在しないと解釈されてしまうので、空文字列も受け入れるようにしています。*/
  private setupMongo(): void {
    setMongoCheckRequired("String");
    mongoose.connect(MONGO_URI);
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupSendgrid(): void {
    sendgrid.setApiKey(SENDGRID_KEY);
  }

  private setupAws(): void {
    const credentials = {accessKeyId: AWS_KEY, secretAccessKey: AWS_SECRET};
    const region = AWS_REGION;
    aws.config.update({credentials, region});
  }

  /** 内部処理で用いるディレクトリを用意します。*/
  private setupDirectories(): void {
    fs.mkdirSync("./dist/download", {recursive: true});
  }

  /** ルーターの設定を行います。
   * このメソッドは、各種ミドルウェアの設定メソッドを全て呼んだ後に実行してください。*/
  private useRestControllers(): void {
    CommissionRestController.use(this.application, this.server, this.agenda);
    DictionaryRestController.use(this.application, this.server, this.agenda);
    ExampleRestController.use(this.application, this.server, this.agenda);
    HistoryRestController.use(this.application, this.server, this.agenda);
    InvitationRestController.use(this.application, this.server, this.agenda);
    NotificationRestController.use(this.application, this.server, this.agenda);
    OtherRestController.use(this.application, this.server, this.agenda);
    ResourceRestController.use(this.application, this.server, this.agenda);
    UserRestController.use(this.application, this.server, this.agenda);
    WordRestController.use(this.application, this.server, this.agenda);
  }

  private useSocketControllers(): void {
    DictionarySocketController.use(this.application, this.server, this.agenda);
  }

  private useJobControllers(): void {
    DictionaryJobController.use(this.agenda);
    RegularJobController.use(this.agenda);
  }

  private setupSchedules(): void {
    this.agenda.on("ready", () => {
      this.agenda.every("0 3 * * *", "discardOldHistoryWords", {}, {timezone: "Asia/Tokyo"});
      this.agenda.every("30 23 * * *", "addHistories", {}, {timezone: "Asia/Tokyo"});
      this.agenda.start();
    });
  }

  private addStaticHandlers(): void {
    this.application.use("/client", express.static(process.cwd() + "/dist/client"));
    this.application.use("/static", express.static(process.cwd() + "/dist/static"));
  }

  /** ルーターで設定されていない URL にアクセスされたときのフォールバックの設定をします。
   * フロントエンドから呼び出すためのエンドポイント用 URL で処理が存在しないものにアクセスされた場合は、404 エラーを返します。
   * そうでない場合は、フロントエンドのトップページを返します。*/
  private addFallbackHandlers(): void {
    const internalHandler = function (request: Request, response: Response, next: NextFunction): void {
      const fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
      response.status(404).end();
    };
    const otherHandler = function (request: Request, response: Response, next: NextFunction): void {
      const method = request.method;
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
    this.application.use(/\/((?!socket.io).)*/, otherHandler);
  }

  private addErrorHandler(): void {
    const handler = function (error: any, request: Request, response: Response, next: NextFunction): void {
      LogUtil.error("server", null, error);
      response.status(500).end();
    };
    this.application.use(handler);
  }

  private listen(): void {
    this.httpServer.listen(+PORT, () => {
      LogUtil.log("server", {port: +PORT});
    });
  }

}


const main = new Main();
main.main();