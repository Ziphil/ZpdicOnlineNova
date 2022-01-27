//

import * as react from "react";
import {
  ReactElement
} from "react";
import InformationPane from "/client/component/compound/information-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup
} from "/client/component/hook";
import {
  PopupUtil
} from "/client/util/popup";


const PopupInformationPane = create(
  require("./popup-information-pane.scss"), "PopupInformationPane",
  function ({
  }: {
  }): ReactElement {

    let [intl] = useIntl();
    let [popupSpecs, {clearPopup}] = usePopup();

    let specNodes = popupSpecs.map((spec) => {
      let specNode = (
        <div styleName="pane-wrapper" key={spec.id}>
          <InformationPane texts={[PopupUtil.getMessage(intl, spec.type)]} style={spec.style} onClose={() => clearPopup(spec.id)}/>
        </div>
      );
      return specNode;
    });
    let node = (
      <div styleName="root">
        {specNodes}
      </div>
    );
    return node;

  }
);


export default PopupInformationPane;