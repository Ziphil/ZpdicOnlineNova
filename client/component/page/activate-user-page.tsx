//

import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactElement
} from "react";
import {
  useMount
} from "react-use";
import Loading from "/client/component/compound/loading";
import {
  create
} from "/client/component/create";
import {
  useLocation,
  usePath,
  usePopup,
  useRequest
} from "/client/component/hook";
import Page from "/client/component/page/page";


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
      let search = queryParser.parse(location.searchString);
      let key = (typeof search.key === "string") ? search.key : "";
      let response = await request("activateUser", {key});
      if (response.status === 200) {
        addInformationPopup("userActivated");
        pushPath("/dashboard", {preservePopup: true});
      } else {
        pushPath("/", {preservePopup: true});
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