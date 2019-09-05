//

import * as express from "express";


const PORT = 3000;

function main(): void {
  let app = express();
  app.get("/", (req, res) => {
    res.send("Hello World!!");
  });
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
}

main();