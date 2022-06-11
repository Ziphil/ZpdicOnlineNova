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

    const [intl] = useIntl();
    const [popupSpecs, {clearPopup}] = usePopup();

    const specNodes = popupSpecs.map((spec) => {
      const specNode = (
        <div styleName="pane-wrapper" key={spec.id}>
          <InformationPane texts={[PopupUtil.getMessage(intl, spec.type)]} style={spec.style} onClose={() => clearPopup(spec.id)}/>
        </div>
      );
      return specNode;
    });
    const node = (
      <div styleName="root">
        {specNodes}
      </div>
    );
    return node;

  }
);


export default PopupInformationPane;