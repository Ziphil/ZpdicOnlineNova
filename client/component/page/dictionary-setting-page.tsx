//

import {
  ReactElement,
  Suspense
} from "react";
import Link from "/client/component/atom/link";
import CommissionList from "/client/component/compound/commission-list";
import DictionaryStatisticsPane from "/client/component/compound/dictionary-statistics-pane";
import HistoryPane from "/client/component/compound/history-pane";
import Loading from "/client/component/compound/loading";
import Menu from "/client/component/compound/menu";
import MenuItem from "/client/component/compound/menu-item";
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
  useLocation,
  useParams,
  usePath,
  useSuspenseQuery,
  useTrans
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
    const {trans} = useTrans("dictionarySettingPage");

    const number = +params.number;
    const [dictionary] = useSuspenseQuery("fetchDictionary", {number}, {}, EnhancedDictionary.enhance);
    const [[, commissionSize]] = useSuspenseQuery("fetchCommissions", {number, offset: 0, size: 30});
    const [] = useSuspenseQuery("checkDictionaryAuthorization", {number, authority: "own"});

    const mode = location.hash || "general";
    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={true} showSettingLink={true}>
        <Menu mode={mode}>
          <MenuItem mode="general" label={trans("general")} iconName="info-circle" href="#general"/>
          <MenuItem mode="setting" label={trans("setting")} iconName="cog" href="#setting"/>
          <MenuItem mode="access" label={trans("access")} iconName="users" href="#access"/>
          <MenuItem mode="request" label={trans("commission")} iconName="list-check" badgeValue={commissionSize} href="#request"/>
          <MenuItem mode="resource" label={trans("resource")} iconName="image" href="#resource"/>
          <MenuItem mode="statistics" label={trans("statistics")} iconName="chart-line" href="#statistics"/>
        </Menu>
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

    const {trans, transNode} = useTrans("dictionarySettingPage");
    const {pushPath} = usePath();

    if (mode === "general") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
          <SettingPane
            label={trans("changeDictionaryNameForm.label")}
            description={trans("changeDictionaryNameForm.description")}
          >
            <ChangeDictionaryNameForm number={dictionary.number} currentName={dictionary.name}/>
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryParamNameForm.label")}
            description={trans("changeDictionaryParamNameForm.description")}
          >
            <ChangeDictionaryParamNameForm number={dictionary.number} currentParamName={dictionary.paramName}/>
          </SettingPane>
          <SettingPane
            label={trans("changeDictionarySecretForm.label")}
            description={trans("changeDictionarySecretForm.description")}
          >
            <ChangeDictionarySecretForm number={dictionary.number} currentSecret={dictionary.secret}/>
          </SettingPane>
          <SettingPane
            label={trans("uploadDictionaryForm.label")}
            description={trans("uploadDictionaryForm.description")}
          >
            <UploadDictionaryForm number={dictionary.number}/>
          </SettingPane>
          <SettingPane
            label={trans("discardDictionaryForm.label")}
            description={trans("discardDictionaryForm.description")}
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
            label={trans("changeDictionaryExplanationForm.label")}
            description={trans("changeDictionaryExplanationForm.description")}
            forceWide={true}
          >
            <ChangeDictionaryExplanationForm
              number={dictionary.number}
              currentExplanation={dictionary.explanation}
            />
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryAkrantiainSourceForm.label")}
            description={transNode("changeDictionaryAkrantiainSourceForm.description", {
              link: (parts) => <Link href="/document">{parts}</Link>
            })}
            forceWide={true}
          >
            <ChangeDictionarySourceForm
              number={dictionary.number}
              currentSource={dictionary.settings.akrantiainSource}
              language="akrantiain"
            />
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryZatlinSourceForm.label")}
            description={transNode("changeDictionaryZatlinSourceForm.description", {
              link: (parts) => <Link href="/document">{parts}</Link>
            })}
            forceWide={true}
          >
            <ChangeDictionarySourceForm
              number={dictionary.number}
              currentSource={dictionary.settings.zatlinSource}
              language="zatlin"
            />
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryPronunciationTitleForm.label")}
            description={trans("changeDictionaryPronunciationTitleForm.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="pronunciationTitle"
            />
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryExampleTitleForm.label")}
            description={trans("changeDictionaryExampleTitleForm.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="exampleTitle"
            />
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryEnableMarkdownForm.label")}
            description={trans("changeDictionaryEnableMarkdownForm.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="enableMarkdown"
            />
          </SettingPane>
          <SettingPane
            label={trans("changeDictionaryEnableDuplicateName.label")}
            description={trans("changeDictionaryEnableDuplicateName.description")}
          >
            <ChangeDictionarySettingsForm
              number={dictionary.number}
              currentSettings={dictionary.settings}
              propertyName="enableDuplicateName"
            />
          </SettingPane>
        </Suspense>
      );
      return node;
    } else if (mode === "access") {
      const node = (
        <Suspense fallback={<DictionarySettingPageLoading/>}>
          <SettingPane
            label={trans("addEditInvitationForm.label")}
            description={trans("addEditInvitationForm.description")}
          >
            <AddEditInvitationForm number={dictionary.number} dictionary={dictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("addTransferInvitationForm.label")}
            description={trans("addTransferInvitationForm.description")}
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
            label={trans("dictionaryStatisticsPane.label")}
            description={trans("dictionaryStatisticsPane.description")}
          >
            <DictionaryStatisticsPane dictionary={dictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("historyPane.label")}
            description={trans("historyPane.description")}
            forceWide={true}
          >
            <HistoryPane dictionary={dictionary}/>
          </SettingPane>
          <SettingPane
            label={trans("wordNameFrequencyPane.label")}
            description={trans("wordNameFrequencyPane.description")}
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