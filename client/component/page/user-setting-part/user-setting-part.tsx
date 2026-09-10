//

import {faCode, faGauge, faPalette, faSliders} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Outlet, useMatch, useParams} from "react-router";
import {AdditionalProps, GeneralIcon, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client/component/atom/tab";
import {create} from "/client/component/create";
import {useMe} from "/client/hook/auth";


export const UserSettingPart = create(
  require("./user-setting-part.scss"), "UserSettingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userSettingPart");

    const match = useMatch("/user/:name/settings/:tabPath?");
    const tabValue = getTabValue(match?.params.tabPath);

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        <TabList styleName="tab-list" value={tabValue ?? ""} scheme="primary">
          <LinkTab value="general" href={`/user/${name}/settings`}>
            <TabIconbag><GeneralIcon icon={faSliders}/></TabIconbag>
            {trans("tab.general")}
          </LinkTab>
          <LinkTab value="appearance" href={`/user/${name}/settings/appearance`}>
            <TabIconbag><GeneralIcon icon={faPalette}/></TabIconbag>
            {trans("tab.appearance")}
          </LinkTab>
          <LinkTab value="developer" href={`/user/${name}/settings/developer`}>
            <TabIconbag><GeneralIcon icon={faCode}/></TabIconbag>
            {trans("tab.developer")}
          </LinkTab>
          <LinkTab value="limit" href={`/user/${name}/settings/limits`}>
            <TabIconbag><GeneralIcon icon={faGauge}/></TabIconbag>
            {trans("tab.limit")}
          </LinkTab>
        </TabList>
        <Outlet context={{me}}/>
      </div>
    ) : null;

  }
);


function getTabValue(tabPath: string | undefined): string | null {
  if (tabPath === undefined) {
    return "general";
  } else if (tabPath === "appearance") {
    return "appearance";
  } else if (tabPath === "developer") {
    return "developer";
  } else if (tabPath === "limits") {
    return "limit";
  } else {
    return null;
  }
}
