//

import * as react from "react";
import {
  ReactElement,
  Suspense
} from "react";
import Markdown from "/client/component/atom/markdown";
import CommissionList from "/client/component/compound/commission-list";
import DictionaryStatisticsPane from "/client/component/compound/dictionary-statistics-pane";
import HistoryPane from "/client/component/compound/history-pane";
import Loading from "/client/component/compound/loading";
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
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const DictionarySettingPage = create(
  require("./dictionary-setting-page.scss"), "DictionarySettingPage",
  function ({
  }: {
  }): ReactElement {

    const params = useParams();
    const location = useLocation();
    const [, {trans}] = useIntl();

    const number = +params.number;
    const [dictionary] = useSuspenseQuery("fetchDictionary", {number}, {}, EnhancedDictionary.enhance);
    const [[, commissionSize]] = useSuspenseQuery("fetchCommissions", {number, offset: 0, size: 30});
    const [] = useSuspenseQuery("checkDictionaryAuthorization", {number, authority: "own"});

    const mode = location.hash || "general";
    const menuSpecs = [
      {mode: "general", label: trans("dictionarySettingPage.general"), iconName: "info-circle", href: "#general"},
      {mode: "setting", label: trans("dictionarySettingPage.setting"), iconName: "cog", href: "#setting"},
      {mode: "access", label: trans("dictionarySettingPage.access"), iconName: "users", href: "#access"},
      {mode: "request", label: trans("dictionarySettingPage.commission"), iconName: "list-check", badgeValue: commissionSize, href: "#request"},
      {mode: "resource", label: trans("dictionarySettingPage.resource"), iconName: "image", href: "#resource"},
      {mode: "statistics", label: trans("dictionarySettingPage.statistics"), iconName: "chart-line", href: "#statistics"}
    ] as const;
    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={true} showSettingLink={true}>
        <Menu mode={mode} specs={menuSpecs}/>
        <DictionarySettingPageForms {...{dictionary, mode}}/>
      </Page>
    );
    return node;

  }
);


const DictionarySettingPageForms = create(
  require("./dictionary-setting-page.scss"),
  function ({
    dictionary,
    mode
  }: {
    dictionary: EnhancedDictionary,
    mode: string
  }): ReactElement | null {

    const [, {trans}] = useIntl();
    const {pushPath} = usePath();

    if (mode === "general") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryNameForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryNameForm.description")}
          >
            <ChangeDictionaryNameForm number={dictionary.number} currentName={dictionary.name}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryParamNameForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryParamNameForm.description")}
          >
            <ChangeDictionaryParamNameForm number={dictionary.number} currentParamName={dictionary.paramName}/>
          </SettingPane>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionarySecretForm.label")}
            description={trans("dictionarySettingPage.changeDictionarySecretForm.description")}
          >
            <ChangeDictionarySecretForm number={dictionary.number} currentSecret={dictionary.secret}/>
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
        </Suspense>
      );
      return node;
    } else if (mode === "setting") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
          <SettingPane
            label={trans("dictionarySettingPage.changeDictionaryExplanationForm.label")}
            description={trans("dictionarySettingPage.changeDictionaryExplanationForm.description")}
            forceWide={true}
          >
            <ChangeDictionaryExplanationForm
              number={dictionary.number}
              currentExplanation={dictionary.explanation}
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
            />
          </SettingPane>
        </Suspense>
      );
      return node;
    } else if (mode === "access") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
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
        </Suspense>
      );
      return node;
    } else if (mode === "request") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
          <SettingPane>
            <CommissionList dictionary={dictionary} size={30}/>
          </SettingPane>
        </Suspense>
      );
      return node;
    } else if (mode === "resource") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
          <SettingPane>
            <ResourceList dictionary={dictionary} size={20}/>
          </SettingPane>
        </Suspense>
      );
      return node;
    } else if (mode === "statistics") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
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
        </Suspense>
      );
      return node;
    } else {
      return null;
    }

  }
);


const DictionarySettingPageLoading = create(
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


export default DictionarySettingPage;