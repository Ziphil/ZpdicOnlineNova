//

import {faBell, faBook, faCog} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Badge, GeneralIcon, SingleLineText, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client-new/component/atom/tab";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {MainContainer} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";
import {useResponse} from "/client-new/hook/request";
import {User} from "/client-new/skeleton";


export const UserHeader = create(
  require("./user-header.scss"), "UserHeader",
  function ({
    user,
    width = "normal",
    tabValue,
    ...rest
  }: {
    user: User,
    width?: "normal" | "wide",
    tabValue: UserHeaderTabValue,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("userHeader");

    const me = useMe();
    const [dictionaries] = useResponse("fetchUserDictionaries", {name: user.name});

    return (
      <header styleName="root" {...rest}>
        <MainContainer width={width}>
          <div styleName="top">
            <UserAvatar styleName="avatar" user={user}/>
            <div styleName="name-container">
              <SingleLineText styleName="screen-name" is="h2">
                {user.screenName}
              </SingleLineText>
              <SingleLineText styleName="name" is="span">
                @{user.name}
              </SingleLineText>
            </div>
          </div>
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <LinkTab value="dictionary" href={`/user/${user.name}`}>
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
              <Badge styleName="badge" scheme={(tabValue === "dictionary") ? "secondary" : "gray"} variant="solid">
                {transNumber(dictionaries?.length)}
              </Badge>
            </LinkTab>
            {(user.id === me?.id) && (
              <LinkTab value="notification" href={`/user/${user.name}/notifications`}>
                <TabIconbag><GeneralIcon icon={faBell}/></TabIconbag>
                {trans("tab.notification")}
              </LinkTab>
            )}
            {(user.id === me?.id) && (
              <LinkTab value="setting" href={`/user/${user.name}/settings`}>
                <TabIconbag><GeneralIcon icon={faCog}/></TabIconbag>
                {trans("tab.setting")}
              </LinkTab>
            )}
          </TabList>
        </MainContainer>
      </header>
    );

  }
);


export type UserHeaderTabValue = "dictionary" | "notification" | "setting" | null;