//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";


const Component = create(
  require("./.scss"), "Component",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    return <></>;

  }
);


export default Component;