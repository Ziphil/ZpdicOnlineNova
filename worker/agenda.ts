//

import {
  Agenda
} from "agenda";
import {
  MONGO_URI
} from "/server/variable";


export const agenda = new Agenda({
  db: {address: MONGO_URI, collection: "agenda"}
});