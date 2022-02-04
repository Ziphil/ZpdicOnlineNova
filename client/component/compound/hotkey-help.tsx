//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Overlay from "/client/component/atom/overlay";
import Menu from "/client/component/compound/menu";
import {
  create
} from "/client/component/create";
import {
  HotkeyGroup,
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

    let [currentGroup, setCurrentGroup] = useState<HotkeyGroup>("general");
    let [, {trans}] = useIntl();

    let menuSpecs = [
      {mode: "general", label: trans("hotkeyHelp.general"), iconName: "keyboard", onClick: () => setCurrentGroup("general")},
      {mode: "navigation", label: trans("hotkeyHelp.navigation"), iconName: "location-arrow", onClick: () => setCurrentGroup("navigation")},
      {mode: "editDictionary", label: trans("hotkeyHelp.editDictionary"), iconName: "edit", onClick: () => setCurrentGroup("editDictionary")},
      {mode: "searchWords", label: trans("hotkeyHelp.searchWords"), iconName: "search", onClick: () => setCurrentGroup("searchWords")}
    ] as const;
    let node = (
      <Overlay title={trans("hotkeyHelp.title")} open={open} outsideClosable={true} onClose={onClose}>
        <div styleName="root">
          <div styleName="menu">
            <Menu mode={currentGroup} specs={menuSpecs} direction="vertical"/>
          </div>
          <div styleName="content">
            <HotkeyHelpTable group="general" currentGroup={currentGroup}/>
            <HotkeyHelpTable group="navigation" currentGroup={currentGroup}/>
            <HotkeyHelpTable group="editDictionary" currentGroup={currentGroup}/>
            <HotkeyHelpTable group="searchWords" currentGroup={currentGroup}/>
          </div>
        </div>
      </Overlay>
    );
    return node;

  }
);


const HotkeyHelpTable = create(
  require("./hotkey-help.scss"),
  function ({
    group,
    currentGroup
  }: {
    group: HotkeyGroup,
    currentGroup: HotkeyGroup
  }): ReactElement | null {

    let [, {trans}] = useIntl();
    let hotkeySpecs = useHotkeySpecs();

    let displayedHotkeySpecs = hotkeySpecs.filter((hotkeySpec) => hotkeySpec.group === group);
    let hotkeyNodes = displayedHotkeySpecs.map((hotkeySpec) => {
      let key = hotkeySpec.keys[0] ?? "";
      let charNodes = key.split(" ").map((char, index) => <kbd key={index} styleName="key">{char.charAt(0).toUpperCase() + char.slice(1)}</kbd>);
      let hotkeyCellStyleName = StyleNameUtil.create(
        "key-cell",
        {if: hotkeySpec.enabled, false: "disabled"}
      );
      let hotkeyDescriptionStyleName = StyleNameUtil.create(
        "description",
        {if: hotkeySpec.enabled, false: "disabled"}
      );
      let hotkeyNode = (
        <Fragment key={hotkeySpec.name}>
          <div styleName={hotkeyCellStyleName}>
            {charNodes}
          </div>
          <div styleName={hotkeyDescriptionStyleName}>
            {trans(`hotkeyHelp.${hotkeySpec.name}`)}
          </div>
        </Fragment>
      );
      return hotkeyNode;
    });
    let styleName = StyleNameUtil.create(
      "table-wrapper",
      {if: group === currentGroup, false: "hidden"}
    );
    let node = (displayedHotkeySpecs.length > 0) && (
      <div styleName={styleName}>
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