//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const Component = create(
  require("./.scss"), "Component",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    return <></>;

  }
);


export default Component;