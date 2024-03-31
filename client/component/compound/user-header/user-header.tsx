//

import {faBell, faBook, faCog, faSignOutAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {AdditionalProps, Badge, GeneralIcon, SingleLineText, Tab, TabIconbag, TabList, useTrans} from "zographia";
import {LinkTab} from "/client/component/atom/tab";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useLogoutRequest, useMe} from "/client/hook/auth";
import {useResponse} from "/client/hook/request";
import {User} from "/client/skeleton";
import {ActivateMeCallout} from "./activate-me-callout";


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

    const navigate = useNavigate();

    const me = useMe();
    const logout = useLogoutRequest();

    const [dictionaries] = useResponse("fetchUserDictionaries", {name: user.name});
    const [editInvitations] = useResponse("fetchInvitations", (user.id === me?.id) && {type: "edit"});
    const [transferInvitations] = useResponse("fetchInvitations", (user.id === me?.id) && {type: "transfer"});
    const invitations = (editInvitations !== undefined && transferInvitations !== undefined) ? [...editInvitations, ...transferInvitations] : undefined;

    const logoutAndBack = useCallback(async function (): Promise<void> {
      await logout();
      navigate("/");
    }, [logout, navigate]);

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
          {(me !== null && me.name === user.name && !me.activated) && (
            <div styleName="activate">
              <ActivateMeCallout/>
            </div>
          )}
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <LinkTab value="dictionary" href={`/user/${user.name}`}>
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
              {(dictionaries !== undefined) && (
                <Badge styleName="badge" scheme={(tabValue === "dictionary") ? "secondary" : "gray"} variant="solid" size="small">
                  {transNumber(dictionaries.length)}
                </Badge>
              )}
            </LinkTab>
            {(user.id === me?.id) && (
              <LinkTab value="notification" href={`/user/${user.name}/notifications`}>
                <TabIconbag><GeneralIcon icon={faBell}/></TabIconbag>
                {trans("tab.notification")}
                {(invitations !== undefined && invitations.length > 0) && (
                  <Badge styleName="badge" scheme={(tabValue === "notification") ? "secondary" : "gray"} variant="solid" size="small" animate={true}>
                    {transNumber(invitations.length)}
                  </Badge>
                )}
              </LinkTab>
            )}
            {(user.id === me?.id) && (
              <LinkTab value="setting" href={`/user/${user.name}/settings`}>
                <TabIconbag><GeneralIcon icon={faCog}/></TabIconbag>
                {trans("tab.setting")}
              </LinkTab>
            )}
            {(user.id === me?.id) && (
              <Tab value="logout" onClick={logoutAndBack}>
                <TabIconbag><GeneralIcon icon={faSignOutAlt}/></TabIconbag>
                {trans("tab.logout")}
              </Tab>
            )}
          </TabList>
        </MainContainer>
      </header>
    );

  }
);


export type UserHeaderTabValue = "dictionary" | "notification" | "setting" | null;