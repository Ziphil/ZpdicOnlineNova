//

import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import Overlay from "/client/component/atom/overlay";
import {
  create
} from "/client/component/create";
import {
  useHotkeySpecs,
  useIntl
} from "/client/component/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const HotkeyHelp = create(
  require("./hotkey-help.scss"), "HotkeyHelp",
  function ({
    open,
    onClose
  }: {
    open: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => void
  }): ReactElement {

    let [, {trans}] = useIntl();
    let hotkeySpecs = useHotkeySpecs();

    let node = (
      <Overlay title={trans("hotkeyHelp.title")} open={open} outsideClosable={true} onClose={onClose}>
        HOTKEY
      </Overlay>
    );
    return node;

  }
);


export default HotkeyHelp;