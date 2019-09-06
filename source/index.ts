//

import * as express from "express";
import {
  Express
} from "express";
import * as session from "express-session";
import * as mongoose from "mongoose";
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
    this.setupRouters();
    this.setupSession();
    this.setupMongo();
    this.listen();
  }

  private setupRouters(): void {
    let userController = new UserController();
    this.application.use(userController.path, userController.router);
  }

  private setupSession(): void {
    this.application.use(session({
      secret: "zpdic",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000
      }
    }));
  }

  private setupMongo(): void {
    mongoose.connect(MONGO_URI);
  }

  private listen(): void {
    this.application.listen(PORT, HOSTNAME, () => {
      console.log("Listening on port " + PORT);
    });
  }

}


let main = new Main();
main.main();