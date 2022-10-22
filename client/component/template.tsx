//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  usePopup,
  useRequest,
  useTrans
} from "/client/component/hook";


const Component = create(
  require("./.scss"), "Component",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("");
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    return <></>;

  }
);


export default Component;