//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
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
  useLocation,
  useParams,
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

    const [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    const [commissionCount, setCommissionCount] = useState(0);
    const [authorized, setAuthorized] = useState(false);
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const params = useParams();
    const location = useLocation();

    const fetchDictionary = useCallback(async function (): Promise<void> {
      const number = +params.number;
      const response = await request("fetchDictionary", {number});
      if (response.status === 200 && !("error" in response.data)) {
        const dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.number, request]);

    const fetchCommissionCount = useCallback(async function (): Promise<void> {
      const number = +params.number;
      const size = 1;
      const response = await request("fetchCommissions", {number, size});
      if (response.status === 200 && !("error" in response.data)) {
        const commissionCount = response.data[1];
        setCommissionCount(commissionCount);
      } else {
        setCommissionCount(0);
      }
    }, [params.number, request]);

    const checkAuthorization = useCallback(async function (): Promise<void> {
      const number = +params.number;
      const authority = "own" as const;
      const response = await request("checkDictionaryAuthorization", {number, authority});
      if (response.status === 200) {
        setAuthorized(true);
      }
    }, [params.number, request]);

    useMount(async () => {
      const promise = Promise.all([fetchDictionary(), fetchCommissionCount(), checkAuthorization()]);
      await promise;
    });

    const mode = location.hash || "general";
    const actualCommissionCount = (commissionCount > 0) ? commissionCount : undefined;
    const menuSpecs = [
      {mode: "general", label: trans("dictionarySettingPage.general"), iconName: "info-circle", href: "#general"},
      {mode: "setting", label: trans("dictionarySettingPage.setting"), iconName: "cog", href: "#setting"},
      {mode: "access", label: trans("dictionarySettingPage.access"), iconName: "users", href: "#access"},
      {mode: "request", label: trans("dictionarySettingPage.commission"), iconName: "list-check", badgeValue: actualCommissionCount, href: "#request"},
      {mode: "resource", label: trans("dictionarySettingPage.resource"), iconName: "image", href: "#resource"},
      {mode: "statistics", label: trans("dictionarySettingPage.statistics"), iconName: "chart-line", href: "#statistics"}
    ] as const;
    const node = (
      <Page dictionary={dictionary} showDictionary={true}>
        <Menu mode={mode} specs={menuSpecs}/>
        {(dictionary && authorized) && <DictionarySettingPageForms {...{dictionary, mode, fetchDictionary, fetchCommissionCount}}/>}
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

    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const {pushPath} = usePath();
    const params = useParams();

    const provideCommissions = useCallback(async function (offset?: number, size?: number): Promise<WithSize<Commission>> {
      const number = +params.number;
      const response = await request("fetchCommissions", {number, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        const hitResult = response.data;
        return hitResult;
      } else {
        return [[], 0];
      }
    }, [params.number, request]);

    if (mode === "general") {
      const node = (
        <Fragment>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryNameForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryNameForm.description")}
          >
            <ChangeDictionaryNameForm number={dictionary.number} currentName={dictionary.name} onSubmit={fetchDictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryParamNameForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryParamNameForm.description")}
          >
            <ChangeDictionaryParamNameForm number={dictionary.number} currentParamName={dictionary.paramName} onSubmit={fetchDictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionarySecretForm.label")}
            description={trans("dictionarySettingPage.changeDictionarySecretForm.description")}
          >
            <ChangeDictionarySecretForm number={dictionary.number} currentSecret={dictionary.secret} onSubmit={fetchDictionary}/>
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
            <DiscardDictionaryForm number={dictionary.number} onSubmit={() => pushPath("/dashboard", {preservePopup: true})}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "setting") {
      const node = (
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
            description={<Markdown source={trans("dictionarySettingPage.changeDictionaryAkrantiainSourceForm.description")} type="simple"/>}
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
            description={<Markdown source={trans("dictionarySettingPage.changeDictionaryZatlinSourceForm.description")} type="simple"/>}
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
            label={trans("dictionarySettingPage.changeDictionaryExampleTitleForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryExampleTitleForm.description")}
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
      const node = (
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
      const node = (
        <Fragment>
          <SettingPane>
            <CommissionList commissions={provideCommissions} dictionary={dictionary} size={30} onDiscardConfirm={fetchCommissionCount}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "resource") {
      const node = (
        <Fragment>
          <SettingPane>
            <ResourceList dictionary={dictionary} size={20}/>
          </SettingPane>
        </Fragment>
      );
      return node;
    } else if (mode === "statistics") {
      const node = (
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