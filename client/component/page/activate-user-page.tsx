//

import * as queryParser from "query-string";
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

    const location = useLocation();
    const {pushPath} = usePath();
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    useMount(async () => {
      const search = queryParser.parse(location.searchString);
      const key = (typeof search.key === "string") ? search.key : "";
      const response = await request("activateUser", {key});
      if (response.status === 200) {
        addInformationPopup("userActivated");
        pushPath("/dashboard", {preservePopup: true});
      } else {
        pushPath("/", {preservePopup: true});
      }
    });

    const node = (
      <Page>
        <Loading/>
      </Page>
    );
    return node;

  }
);


export default ActivateUserPage;