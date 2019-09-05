//

import * as express from "express";
import {
  Express
} from "express";
import {
  UserController
} from "./controller/user";


const PORT = 3000;
const HOSTNAME = "localhost";


class Main {

  private application: Express;

  public constructor() {
    this.application = express();
  }

  public main(): void {
    this.setupRouters();
    this.listen();
  }

  private setupRouters(): void {
    let application = this.application;
    let userController = new UserController();
    application.use("/user", userController.router);
  }

  private listen(): void {
    let application = this.application;
    application.listen(PORT, HOSTNAME, () => {
      console.log("Listening on port " + PORT);
    });
  }

}


let main = new Main();
main.main();