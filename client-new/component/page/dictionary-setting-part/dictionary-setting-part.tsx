//

import {faPen, faSliders, faUsers} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Outlet, useMatch} from "react-router-dom";
import {AdditionalProps, GeneralIcon, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client-new/component/atom/tab";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";


export const DictionarySettingPart = create(
  require("./dictionary-setting-part.scss"), "DictionarySettingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingPart");

    const match = useMatch("/dictionary/:dictionaryNumber/settings/:tabPath");
    const tabValue = match?.params.tabPath || "general";
    const dictionary = useDictionary();

    return (
      <div styleName="root" {...rest}>
        <TabList styleName="tab-list" value={tabValue} scheme="primary">
          <LinkTab value="general" href={`/dictionary/${dictionary.number}/settings`}>
            <TabIconbag><GeneralIcon icon={faSliders}/></TabIconbag>
            {trans("tab.general")}
          </LinkTab>
          <LinkTab value="editing" href={`/dictionary/${dictionary.number}/settings/editing`}>
            <TabIconbag><GeneralIcon icon={faPen}/></TabIconbag>
            {trans("tab.editing")}
          </LinkTab>
          <LinkTab value="permissions" href={`/dictionary/${dictionary.number}/settings/permissions`}>
            <TabIconbag><GeneralIcon icon={faUsers}/></TabIconbag>
            {trans("tab.authority")}
          </LinkTab>
        </TabList>
        <Outlet context={{dictionary}}/>
      </div>
    );

  }
);