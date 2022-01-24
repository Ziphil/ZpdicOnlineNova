//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useParams
} from "react-router-dom";
import {
  useMount
} from "react-use";
import ActivateUserForm from "/client/component-function/compound/activate-user-form";
import DictionaryList from "/client/component-function/compound/dictionary-list";
import InvitationList from "/client/component-function/compound/invitation-list";
import Menu from "/client/component-function/compound/menu";
import SettingPane from "/client/component-function/compound/setting-pane";
import {
  create
} from "/client/component-function/create";
import ChangeUserEmailForm from "/client/component-function/form/change-user-email-form";
import ChangeUserPasswordForm from "/client/component-function/form/change-user-password-form";
import ChangeUserScreenNameForm from "/client/component-function/form/change-user-screen-name-form";
import CreateDictionaryForm from "/client/component-function/form/create-dictionary-form";
import DiscardUserForm from "/client/component-function/form/discard-user-form";
import {
  useIntl,
  usePath,
  useRequest,
  useUser
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";
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

    let [dictionaries, setDictionaries] = useState<Array<UserDictionary> | null>(null);
    let [editInvitations, setEditInvitations] = useState<Array<Invitation> | null>(null);
    let [transferInvitations, setTransferInvitations] = useState<Array<Invitation> | null>(null);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [user] = useUser();
    let params = useParams<{mode: string}>();

    let fetchDictionaries = useCallback(async function (): Promise<void> {
      let response = await request("fetchDictionaries", {});
      if (response.status === 200) {
        let dictionaries = response.data;
        setDictionaries(dictionaries);
      }
    }, [request]);

    let fetchEditInvitations = useCallback(async function (): Promise<void> {
      let type = "edit" as const;
      let response = await request("fetchInvitations", {type});
      if (response.status === 200) {
        let editInvitations = response.data;
        setEditInvitations(editInvitations);
      }
    }, [request]);

    let fetchTransferInvitations = useCallback(async function (): Promise<void> {
      let type = "transfer" as const;
      let response = await request("fetchInvitations", {type});
      if (response.status === 200) {
        let transferInvitations = response.data;
        setTransferInvitations(transferInvitations);
      }
    }, [request]);

    useMount(async () => {
      let promise = Promise.all([fetchDictionaries(), fetchEditInvitations(), fetchTransferInvitations()]);
      await promise;
    });

    let mode = params.mode || "dictionary";
    let dictionaryCount = dictionaries?.length ?? 0;
    let editNotificationCount = editInvitations?.length ?? 0;
    let transferNotificationCount = transferInvitations?.length ?? 0;
    let notificationCount = editNotificationCount + transferNotificationCount;
    let menuSpecs = [
      {mode: "dictionary", label: trans("dashboardPage.dictionary"), iconLabel: "\uF02D", badgeValue: dictionaryCount || undefined, href: "/dashboard"},
      {mode: "notification", label: trans("dashboardPage.notification"), iconLabel: "\uF0F3", badgeValue: notificationCount || undefined, href: "/dashboard/notification"},
      {mode: "account", label: trans("dashboardPage.account"), iconLabel: "\uF2C2", href: "/dashboard/account"},
      {mode: "logout", label: trans("dashboardPage.logout"), iconLabel: "\uF2F5", href: "/"}
    ];
    let activateUserForm = (!user?.activated) && (
      <div styleName="activate">
        <ActivateUserForm/>
      </div>
    );
    let contentNode = (user) && <DashboardPageForms {...{dictionaries, editInvitations, transferInvitations, mode, fetchEditInvitations, fetchTransferInvitations}}/>;
    let node = (
      <Page>
        {activateUserForm}
        <Menu mode={mode} specs={menuSpecs}/>
        {contentNode}
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
    mode,
    fetchEditInvitations,
    fetchTransferInvitations
  }: {
    dictionaries: Array<UserDictionary> | null,
    editInvitations: Array<Invitation> | null,
    transferInvitations: Array<Invitation> | null
    mode: string,
    fetchEditInvitations: () => Promise<void>,
    fetchTransferInvitations: () => Promise<void>
  }): ReactElement | null {

    let [user, {fetchUser}] = useUser();
    let [, {trans}] = useIntl();
    let {pushPath} = usePath();

    if (mode === "dictionary") {
      let node = (
        <Fragment>
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
        </Fragment>
      );
      return node;
    } else if (mode === "notification") {
      let node = (
        <Fragment>
          <SettingPane
            label={trans("dashboardPage.editInvitationList.label")}
            description={trans("dashboardPage.editInvitationList.description")}
          >
            <InvitationList invitations={editInvitations} size={8} onSubmit={fetchEditInvitations}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.transferInvitationList.label")}
            description={trans("dashboardPage.transferInvitationList.description")}
          >
            <InvitationList invitations={transferInvitations} size={8} onSubmit={fetchTransferInvitations}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "account") {
      let node = (
        <Fragment>
          <SettingPane
            label={trans("dashboardPage.changeUserScreenNameForm.label")}
            description={trans("dashboardPage.changeUserScreenNameForm.description")}
          >
            <ChangeUserScreenNameForm currentScreenName={user!.screenName} onSubmit={fetchUser}/>
          </SettingPane>
          <SettingPane
            label={trans("dashboardPage.changeUserEmailForm.label")}
            description={trans("dashboardPage.changeUserEmailForm.description")}
          >
            <ChangeUserEmailForm currentEmail={user!.email} onSubmit={fetchUser}/>
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
            <DiscardUserForm onSubmit={() => pushPath("/", undefined, true)}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default DashboardPage;