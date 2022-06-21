//

import * as react from "react";
import {
  ReactElement,
  Suspense,
  useCallback
} from "react";
import ActivateUserForm from "/client/component/compound/activate-user-form";
import DictionaryList from "/client/component/compound/dictionary-list";
import InvitationList from "/client/component/compound/invitation-list";
import Loading from "/client/component/compound/loading";
import Menu from "/client/component/compound/menu";
import SettingPane from "/client/component/compound/setting-pane";
import {
  create
} from "/client/component/create";
import ChangeUserEmailForm from "/client/component/form/change-user-email-form";
import ChangeUserNameForm from "/client/component/form/change-user-name-form";
import ChangeUserPasswordForm from "/client/component/form/change-user-password-form";
import ChangeUserScreenNameForm from "/client/component/form/change-user-screen-name-form";
import CreateDictionaryForm from "/client/component/form/create-dictionary-form";
import DiscardUserForm from "/client/component/form/discard-user-form";
import {
  useIntl,
  useLocation,
  useLogout,
  usePath,
  useSuspenseMe,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  UserDictionary
} from "/client/skeleton/dictionary";
import {
  Invitation
} from "/client/skeleton/invitation";


const DashboardPage = create(
  require("./dashboard-page.scss"), "DashboardPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {pushPath} = usePath();
    const logout = useLogout();
    const location = useLocation();

    const [dictionaries] = useSuspenseQuery("fetchDictionaries", {});
    const [editInvitations] = useSuspenseQuery("fetchInvitations", {type: "edit"});
    const [transferInvitations] = useSuspenseQuery("fetchInvitations", {type: "transfer"});
    const [me] = useSuspenseMe();

    const performLogout = useCallback(async function (): Promise<void> {
      const response = await logout();
      if (response.status === 200) {
        pushPath("/");
      }
    }, [pushPath, logout]);

    const mode = location.hash || "dictionary";
    const dictionaryCount = dictionaries.length;
    const editNotificationCount = editInvitations.length;
    const transferNotificationCount = transferInvitations.length;
    const notificationCount = editNotificationCount + transferNotificationCount;
    const menuSpecs = [
      {mode: "dictionary", label: trans("dashboardPage.dictionary"), iconName: "book", badgeValue: dictionaryCount, href: "#dictionary"},
      {mode: "notification", label: trans("dashboardPage.notification"), iconName: "bell", badgeValue: notificationCount, href: "#notification"},
      {mode: "account", label: trans("dashboardPage.account"), iconName: "id-card", href: "#account"},
      {mode: "logout", label: trans("dashboardPage.logout"), iconName: "sign-out-alt", onClick: performLogout}
    ] as const;
    const node = (
      <Page title={trans("dashboardPage.title")}>
        {(!me.activated) && (
          <div styleName="activate">
            <ActivateUserForm/>
          </div>
        )}
        <Menu mode={mode} specs={menuSpecs}/>
        <DashboardPageForms {...{dictionaries, editInvitations, transferInvitations, mode}}/>
      </Page>
    );
    return node;

  }
);


const DashboardPageForms = create(
  require("./dashboard-page.scss"),
  function ({
    dictionaries,
    editInvitations,
    transferInvitations,
    mode
  }: {
    dictionaries: Array<UserDictionary>,
    editInvitations: Array<Invitation>,
    transferInvitations: Array<Invitation>,
    mode: string
  }): ReactElement | null {

    const [user, {refetchMe}] = useSuspenseMe();
    const [, {trans}] = useIntl();
    const {pushPath} = usePath();

    if (mode === "dictionary") {
      const node = (
        <Suspense fallback={<DashboardPageLoading/>}>
          <SettingPane
            label={trans("dashboardPage.dictionaryList.label")}
            description={trans("dashboardPage.dictionaryList.description")}
          >
            <DictionaryList dictionaries={dictionaries} showLinks={true} size={8}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.createDictionaryForm.label")}
            description={trans("dashboardPage.createDictionaryForm.description")}
          >
            <CreateDictionaryForm/>
          </SettingPane>
        </Suspense>
      );
      return node;
    } else if (mode === "notification") {
      const node = (
        <Suspense fallback={<DashboardPageLoading/>}>
          <SettingPane
            label={trans("dashboardPage.editInvitationList.label")}
            description={trans("dashboardPage.editInvitationList.description")}
          >
            <InvitationList invitations={editInvitations} size={8}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.transferInvitationList.label")}
            description={trans("dashboardPage.transferInvitationList.description")}
          >
            <InvitationList invitations={transferInvitations} size={8}/>
          </SettingPane>
        </Suspense>
      );
      return node;
    } else if (mode === "account") {
      const node = (
        <Suspense fallback={<DashboardPageLoading/>}>
          <SettingPane
            label={trans("dashboardPage.changeUserNameForm.label")}
            description={trans("dashboardPage.changeUserNameForm.description")}
          >
            <ChangeUserNameForm currentName={user.name} onSubmit={refetchMe}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.changeUserScreenNameForm.label")}
            description={trans("dashboardPage.changeUserScreenNameForm.description")}
          >
            <ChangeUserScreenNameForm currentScreenName={user.screenName} onSubmit={refetchMe}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.changeUserEmailForm.label")}
            description={trans("dashboardPage.changeUserEmailForm.description")}
          >
            <ChangeUserEmailForm currentEmail={user.email} onSubmit={refetchMe}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.changeUserPasswordForm.label")}
            description={trans("dashboardPage.changeUserPasswordForm.description")}
          >
            <ChangeUserPasswordForm/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.discardUserForm.label")}
            description={trans("dashboardPage.discardUserForm.description")}
          >
            <DiscardUserForm onSubmit={() => pushPath("/", {preservePopup: true})}/>
          </SettingPane>
        </Suspense>
      );
      return node;
    } else {
      return null;
    }

  }
);


const DashboardPageLoading = create(
  require("./dictionary-setting-page.scss"),
  function ({
  }: {
  }): ReactElement {

    const node = (
      <SettingPane>
        <Loading/>
      </SettingPane>
    );
    return node;

  }
);


export default DashboardPage;