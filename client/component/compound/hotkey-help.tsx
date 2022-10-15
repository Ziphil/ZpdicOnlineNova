//

import {
  Fragment,
  MouseEvent,
  ReactElement,
  useState
} from "react";
import Overlay from "/client/component/atom/overlay";
import Menu from "/client/component/compound/menu";
import MenuItem from "/client/component/compound/menu-item";
import {
  create
} from "/client/component/create";
import {
  HotkeyGroup,
  HotkeySpec,
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

    const [currentGroup, setCurrentGroup] = useState<HotkeyGroup>("general");
    const [, {trans}] = useIntl();

    const node = (
      <Overlay title={trans("hotkeyHelp.title")} open={open} outsideClosable={true} onClose={onClose}>
        <div styleName="root">
          <div styleName="main">
            <div styleName="content">
              <div styleName="information">
                {trans("hotkeyHelp.information")}
              </div>
              <div styleName="table-list">
                <HotkeyHelpTable group="general" currentGroup={currentGroup}/>
                <HotkeyHelpTable group="navigation" currentGroup={currentGroup}/>
                <HotkeyHelpTable group="editDictionary" currentGroup={currentGroup}/>
                <HotkeyHelpTable group="searchWords" currentGroup={currentGroup}/>
              </div>
            </div>
            <div styleName="menu">
              <Menu mode={currentGroup} direction="vertical">
                <MenuItem mode="general" label={trans("hotkeyHelp.general")} iconName="keyboard" onClick={() => setCurrentGroup("general")}/>
                <MenuItem mode="navigation" label={trans("hotkeyHelp.navigation")} iconName="location-arrow" onClick={() => setCurrentGroup("navigation")}/>
                <MenuItem mode="editDictionary" label={trans("hotkeyHelp.editDictionary")} iconName="edit" onClick={() => setCurrentGroup("editDictionary")}/>
                <MenuItem mode="searchWords" label={trans("hotkeyHelp.searchWords")} iconName="search" onClick={() => setCurrentGroup("searchWords")}/>
              </Menu>
            </div>
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

    const [, {trans}] = useIntl();
    const hotkeySpecs = useHotkeySpecs();

    const displayedHotkeySpecs = hotkeySpecs.filter((spec) => spec.group === group);
    const groupedHotkeySpecs = displayedHotkeySpecs.reduce<Array<Array<HotkeySpec>>>((prev, spec) => {
      if (prev[spec.subgroup] === undefined) {
        prev[spec.subgroup] = [];
      }
      prev[spec.subgroup].push(spec);
      return prev;
    }, []);
    const nodes = [[], []] as Array<Array<ReactElement>>;
    groupedHotkeySpecs.forEach((specs, subgroup) => {
      specs.forEach((spec, index) => {
        const key = spec.keys[0] ?? "";
        const charNodes = key.split(" ").map((char, index) => <kbd key={index} styleName="key">{char.charAt(0).toUpperCase() + char.slice(1)}</kbd>);
        const hotkeyCellStyleName = StyleNameUtil.create(
          "key-cell",
          {if: spec.enabled, false: "disabled"},
          {if: subgroup > 0 && index <= 1, true: "top-margin"}
        );
        const hotkeyDescriptionStyleName = StyleNameUtil.create(
          "description",
          {if: spec.enabled, false: "disabled"},
          {if: subgroup > 0 && index <= 1, true: "top-margin"}
        );
        const hotkeyNode = (
          <Fragment key={spec.name}>
            <div styleName={hotkeyCellStyleName}>
              {charNodes}
            </div>
            <div styleName={hotkeyDescriptionStyleName}>
              {trans(`hotkeyHelp.${spec.name}`)}
            </div>
          </Fragment>
        );
        nodes[index % 2].push(hotkeyNode);
      });
      if (specs.length % 2 !== 0) {
        const dummyNode = (
          <Fragment key={`${specs[0].group}-dummy-${subgroup}`}>
            <div></div>
            <div>&nbsp;</div>
          </Fragment>
        );
        nodes[1].push(dummyNode);
      }
    });
    const styleName = StyleNameUtil.create(
      "table-wrapper",
      {if: group === currentGroup, false: "hidden"}
    );
    const node = (displayedHotkeySpecs.length > 0) && (
      <div styleName={styleName}>
        <div styleName="table">
          {nodes[0]}
        </div>
        <div styleName="table">
          {nodes[1]}
        </div>
      </div>
    );
    return node || null;

  }
);


export default HotkeyHelp;