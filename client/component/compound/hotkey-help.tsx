//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement
} from "react";
import Overlay from "/client/component/atom/overlay";
import {
  create
} from "/client/component/create";
import {
  HotkeyGroup,
  useHotkeySpecs,
  useIntl
} from "/client/component/hook";


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

    let node = (
      <Overlay title={trans("hotkeyHelp.title")} open={open} outsideClosable={true} onClose={onClose}>
        <div styleName="root">
          <HotkeyHelpTable group="general"/>
          <HotkeyHelpTable group="navigation"/>
          <HotkeyHelpTable group="dictionary"/>
        </div>
      </Overlay>
    );
    return node;

  }
);


const HotkeyHelpTable = create(
  require("./hotkey-help.scss"),
  function ({
    group
  }: {
    group: HotkeyGroup
  }): ReactElement | null {

    let [, {trans}] = useIntl();
    let hotkeySpecs = useHotkeySpecs();

    let displayedHotkeySpecs = hotkeySpecs.filter((hotkeySpec) => hotkeySpec.group === group);
    let hotkeyNodes = displayedHotkeySpecs.map((hotkeySpec) => {
      let key = (typeof hotkeySpec.key === "string") ? hotkeySpec.key : hotkeySpec.key[0];
      let charNodes = key.split(" ").flatMap((char, index) => <kbd styleName="key">{char.charAt(0).toUpperCase() + char.slice(1)}</kbd>);
      let hotkeyNode = (
        <Fragment key={hotkeySpec.name}>
          <div styleName="key-cell">
            {charNodes}
          </div>
          <div styleName="description">
            {trans(`hotkeyHelp.${hotkeySpec.name}`)}
          </div>
        </Fragment>
      );
      return hotkeyNode;
    });
    let node = (displayedHotkeySpecs.length > 0) && (
      <div styleName="table-wrapper">
        <div styleName="head">{trans(`hotkeyHelp.${group}`)}</div>
        <div styleName="table-wrapper">
          <div styleName="table">
            {hotkeyNodes}
          </div>
        </div>
      </div>
    );
    return node || null;

  }
);


export default HotkeyHelp;