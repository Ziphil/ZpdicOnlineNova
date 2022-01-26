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
import Markdown from "/client/component/atom/markdown";
import CommissionList from "/client/component/compound/commission-list";
import DictionaryStatisticsPane from "/client/component/compound/dictionary-statistics-pane";
import HistoryPane from "/client/component/compound/history-pane";
import Menu from "/client/component/compound/menu";
import ResourceList from "/client/component/compound/resource-list";
import SettingPane from "/client/component/compound/setting-pane";
import WordNameFrequencyPane from "/client/component/compound/word-name-frequency-pane";
import {
  create
} from "/client/component/create";
import AddEditInvitationForm from "/client/component/form/add-edit-invitation-form";
import AddTransferInvitationForm from "/client/component/form/add-transfer-invitation-form";
import ChangeDictionaryExplanationForm from "/client/component/form/change-dictionary-explanation-form";
import ChangeDictionaryNameForm from "/client/component/form/change-dictionary-name-form";
import ChangeDictionaryParamNameForm from "/client/component/form/change-dictionary-param-name-form";
import ChangeDictionarySecretForm from "/client/component/form/change-dictionary-secret-form";
import ChangeDictionarySettingsForm from "/client/component/form/change-dictionary-settings-form";
import ChangeDictionarySourceForm from "/client/component/form/change-dictionary-source-form";
import DiscardDictionaryForm from "/client/component/form/discard-dictionary-form";
import UploadDictionaryForm from "/client/component/form/upload-dictionary-form";
import {
  useIntl,
  usePath,
  useRequest
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  Commission
} from "/client/skeleton/commission";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


const DictionarySettingPage = create(
  require("./dictionary-setting-page.scss"), "DictionarySettingPage",
  function ({
  }: {
  }): ReactElement {

    let [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    let [commissionCount, setCommissionCount] = useState(0);
    let [authorized, setAuthorized] = useState(false);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let params = useParams<{number: string, mode: string}>();

    let fetchDictionary = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let response = await request("fetchDictionary", {number});
      if (response.status === 200 && !("error" in response.data)) {
        let dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.number, request]);

    let fetchCommissionCount = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let size = 1;
      let response = await request("fetchCommissions", {number, size});
      if (response.status === 200 && !("error" in response.data)) {
        let commissionCount = response.data[1];
        setCommissionCount(commissionCount);
      } else {
        setCommissionCount(0);
      }
    }, [params.number, request]);

    let checkAuthorization = useCallback(async function (): Promise<void> {
      let number = +params.number;
      let authority = "own" as const;
      let response = await request("checkDictionaryAuthorization", {number, authority});
      if (response.status === 200) {
        setAuthorized(true);
      }
    }, [params.number, request]);

    useMount(async () => {
      let promise = Promise.all([fetchDictionary(), fetchCommissionCount(), checkAuthorization()]);
      await promise;
    });

    let number = params.number;
    let mode = params.mode || "general";
    let actualCommissionCount = (commissionCount > 0) ? commissionCount : undefined;
    let menuSpecs = [
      {mode: "general", label: trans("dictionarySettingPage.general"), iconName: "info-circle", href: "/dashboard/dictionary/" + number},
      {mode: "setting", label: trans("dictionarySettingPage.setting"), iconName: "cog", href: "/dashboard/dictionary/setting/" + number},
      {mode: "access", label: trans("dictionarySettingPage.access"), iconName: "users", href: "/dashboard/dictionary/access/" + number},
      {mode: "request", label: trans("dictionarySettingPage.commission"), iconName: "list-alt", badgeValue: actualCommissionCount, href: "/dashboard/dictionary/request/" + number},
      {mode: "resource", label: trans("dictionarySettingPage.resource"), iconName: "file", href: "/dashboard/dictionary/resource/" + number},
      {mode: "statistics", label: trans("dictionarySettingPage.statistics"), iconName: "chart-line", href: "/dashboard/dictionary/statistics/" + number}
    ] as const;
    let contentNodes = (dictionary && authorized) && <DictionarySettingPageForms {...{dictionary, mode, fetchDictionary, fetchCommissionCount}}/>;
    let node = (
      <Page dictionary={dictionary} showDictionary={true}>
        <Menu mode={mode} specs={menuSpecs}/>
        {contentNodes}
      </Page>
    );
    return node;

  }
);


const DictionarySettingPageForms = create(
  require("./dictionary-setting-page.scss"),
  function ({
    dictionary,
    mode,
    fetchDictionary,
    fetchCommissionCount
  }: {
    dictionary: EnhancedDictionary,
    mode: string,
    fetchDictionary: () => Promise<void>,
    fetchCommissionCount: () => Promise<void>
  }): ReactElement | null {

    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let {pushPath} = usePath();
    let params = useParams<{number: string}>();

    let provideCommissions = useCallback(async function (offset?: number, size?: number): Promise<WithSize<Commission>> {
      let number = +params.number;
      let response = await request("fetchCommissions", {number, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let hitResult = response.data;
        return hitResult;
      } else {
        return [[], 0];
      }
    }, [params.number, request]);

    if (mode === "general") {
      let node = (
        <Fragment>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryNameForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryNameForm.description")}
          >
            <ChangeDictionaryNameForm number={dictionary.number} currentName={dictionary.name} onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryParamNameForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryParamNameForm.description")}
          >
            <ChangeDictionaryParamNameForm number={dictionary.number} currentParamName={dictionary.paramName} onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionarySecretForm.label")}
            description={trans("dictionarySettingPage.changeDictionarySecretForm.description")}
          >
            <ChangeDictionarySecretForm number={dictionary.number} currentSecret={dictionary.secret} onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.uploadDictionaryForm.label")}
            description={trans("dictionarySettingPage.uploadDictionaryForm.description")}
          >
            <UploadDictionaryForm number={dictionary.number}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.discardDictionaryForm.label")}
            description={trans("dictionarySettingPage.discardDictionaryForm.description")}
          >
            <DiscardDictionaryForm number={dictionary.number} onSubmit={() => pushPath("/dashboard", undefined, true)}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "setting") {
      let node = (
        <Fragment>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryExplanationForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryExplanationForm.description")}
            forceWide={true}
          >
            <ChangeDictionaryExplanationForm
              number={dictionary.number}
              currentExplanation={dictionary.explanation}
              onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryAkrantiainSourceForm.label")}
            description={<Markdown source={trans("dictionarySettingPage.changeDictionaryAkrantiainSourceForm.description")} simple={true}/>}
            forceWide={true}
          >
            <ChangeDictionarySourceForm
              number={dictionary.number}
              currentSource={dictionary.settings.akrantiainSource}
              language="akrantiain"
              onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryZatlinSourceForm.label")}
            description={<Markdown source={trans("dictionarySettingPage.changeDictionaryZatlinSourceForm.description")} simple={true}/>}
            forceWide={true}
          >
            <ChangeDictionarySourceForm
              number={dictionary.number}
              currentSource={dictionary.settings.zatlinSource}
              language="zatlin"
              onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryPronunciationTitleForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryPronunciationTitleForm.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="pronunciationTitle"
              onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryPronunciationTitleForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryPronunciationTitleForm.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="exampleTitle"
              onSubmit={fetchDictionary}
            />
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryEnableMarkdownForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryEnableMarkdownForm.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="enableMarkdown"
              onSubmit={fetchDictionary}
            />
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "access") {
      let node = (
        <Fragment>
          <SettingPane
            label={trans("dictionarySettingPage.addEditInvitationForm.label")}
            description={trans("dictionarySettingPage.addEditInvitationForm.description")}
          >
            <AddEditInvitationForm number={dictionary.number} dictionary={dictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.addTransferInvitationForm.label")}
            description={trans("dictionarySettingPage.addTransferInvitationForm.description")}
          >
            <AddTransferInvitationForm number={dictionary.number} dictionary={dictionary}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "request") {
      let node = (
        <Fragment>
          <SettingPane>
            <CommissionList commissions={provideCommissions} dictionary={dictionary} size={30} onDiscardConfirm={fetchCommissionCount}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "resource") {
      let node = (
        <Fragment>
          <SettingPane>
            <ResourceList dictionary={dictionary} size={20}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "statistics") {
      let node = (
        <Fragment>
          <SettingPane
            label={trans("dictionarySettingPage.dictionaryStatisticsPane.label")}
            description={trans("dictionarySettingPage.dictionaryStatisticsPane.description")}
          >
            <DictionaryStatisticsPane dictionary={dictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.historyPane.label")}
            description={trans("dictionarySettingPage.historyPane.description")}
            forceWide={true}
          >
            <HistoryPane dictionary={dictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.wordNameFrequencyPane.label")}
            description={trans("dictionarySettingPage.wordNameFrequencyPane.description")}
          >
            <WordNameFrequencyPane dictionary={dictionary}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default DictionarySettingPage;