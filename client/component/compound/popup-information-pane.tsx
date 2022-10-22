//

import {
  ReactElement
} from "react";
import InformationPane from "/client/component/compound/information-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  usePopupSpecs
} from "/client/component/hook";
import {
  PopupUtil
} from "/client/util/popup";


const PopupInformationPane = create(
  require("./popup-information-pane.scss"), "PopupInformationPane",
  function ({
  }: {
  }): ReactElement {

    const intl = useIntl();
    const popupSpecs = usePopupSpecs();
    const {clearPopup} = usePopup();

    const node = (
      <div styleName="root">
        {popupSpecs.map((spec) => (
          <div styleName="pane-wrapper" key={spec.id}>
            <InformationPane texts={[PopupUtil.getMessage(intl, spec.type)]} scheme={spec.scheme} onClose={() => clearPopup(spec.id)}/>
          </div>
        ))}
      </div>
    );
    return node;

  }
);


export default PopupInformationPane;