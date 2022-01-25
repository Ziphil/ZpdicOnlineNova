//

import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactElement
} from "react";
import {
  useLocation
} from "react-router-dom";
import {
  useMount
} from "react-use";
import Loading from "/client/component-function/compound/loading";
import {
  create
} from "/client/component-function/create";
import {
  usePath,
  usePopup,
  useRequest
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const ActivateUserPage = create(
  require("./activate-user-page.scss"), "ActivateUserPage",
  function ({
  }: {
  }): ReactElement {

    let location = useLocation();
    let {pushPath} = usePath();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    useMount(async () => {
      let query = queryParser.parse(location.search);
      let key = (typeof query.key === "string") ? query.key : "";
      let response = await request("activateUser", {key});
      if (response.status === 200) {
        addInformationPopup("userActivated");
        pushPath("/dashboard", undefined, true);
      } else {
        pushPath("/", undefined, true);
      }
    });

    let node = (
      <Page>
        <Loading loading={true}/>
      </Page>
    );
    return node;

  }
);


export default ActivateUserPage;