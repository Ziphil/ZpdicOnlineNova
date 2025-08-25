//

import {faDisplay, faFile, faMemo, faPen, faSliders, faUsers} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Outlet, useMatch} from "react-router-dom";
import {AdditionalProps, GeneralIcon, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client/component/atom/tab";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";


export const DictionarySettingPart = create(
  require("./dictionary-setting-part.scss"), "DictionarySettingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingPart");

    const match = useMatch("/dictionary/:identifier/settings/:tabPath?");
    const tabValue = getTabValue(match?.params.tabPath);

    const dictionary = useDictionary();

    return (
      <div styleName="root" {...rest}>
        <TabList styleName="tab-list" value={tabValue ?? ""} scheme="primary">
          <LinkTab value="general" href={`/dictionary/${match?.params.identifier}/settings`}>
            <TabIconbag><GeneralIcon icon={faSliders}/></TabIconbag>
            {trans("tab.general")}
          </LinkTab>
          <LinkTab value="display" href={`/dictionary/${match?.params.identifier}/settings/display`}>
            <TabIconbag><GeneralIcon icon={faDisplay}/></TabIconbag>
            {trans("tab.display")}
          </LinkTab>
          <LinkTab value="editing" href={`/dictionary/${match?.params.identifier}/settings/editing`}>
            <TabIconbag><GeneralIcon icon={faPen}/></TabIconbag>
            {trans("tab.editing")}
          </LinkTab>
          <LinkTab value="template" href={`/dictionary/${match?.params.identifier}/settings/template`}>
            <TabIconbag><GeneralIcon icon={faMemo}/></TabIconbag>
            {trans("tab.template")}
          </LinkTab>
          <LinkTab value="file" href={`/dictionary/${match?.params.identifier}/settings/file`}>
            <TabIconbag><GeneralIcon icon={faFile}/></TabIconbag>
            {trans("tab.file")}
          </LinkTab>
          <LinkTab value="authority" href={`/dictionary/${match?.params.identifier}/settings/permissions`}>
            <TabIconbag><GeneralIcon icon={faUsers}/></TabIconbag>
            {trans("tab.authority")}
          </LinkTab>
        </TabList>
        <Outlet context={{dictionary}}/>
      </div>
    );

  }
);


function getTabValue(tabPath: string | undefined): string | null {
  if (tabPath === undefined) {
    return "general";
  } else if (tabPath === "display") {
    return "display";
  } else if (tabPath === "editing") {
    return "editing";
  } else if (tabPath === "template") {
    return "template";
  } else if (tabPath === "file") {
    return "file";
  } else if (tabPath === "permissions") {
    return "authority";
  } else {
    return null;
  }
}