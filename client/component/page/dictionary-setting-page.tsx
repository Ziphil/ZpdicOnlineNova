//

import * as react from "react";
import {
  ReactNode
} from "react";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import CommissionList from "/client/component/compound/commission-list";
import HistoryPane from "/client/component/compound/history-pane";
import Menu from "/client/component/compound/menu";
import ResourceList from "/client/component/compound/resource-list";
import SettingPane from "/client/component/compound/setting-pane";
import WordNameFrequencyPane from "/client/component/compound/word-name-frequency-pane";
import {
  style
} from "/client/component/decorator";
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


@style(require("./dictionary-setting-page.scss"))
export default class DictionarySettingPage extends Component<Props, State, Params> {

  public state: State = {
    dictionary: null,
    commissionCount: 0,
    authorized: false
  };

  public async componentDidMount(): Promise<void> {
    let promise = Promise.all([this.fetchDictionary(), this.fetchCommissionCount(), this.checkAuthorization()]);
    await promise;
  }

  private async fetchDictionary(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.request("fetchDictionary", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = EnhancedDictionary.enhance(response.data);
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private async fetchCommissionCount(): Promise<void> {
    let number = +this.props.match!.params.number;
    let size = 1;
    let response = await this.request("fetchCommissions", {number, size});
    if (response.status === 200 && !("error" in response.data)) {
      let commissionCount = response.data[1];
      this.setState({commissionCount});
    } else {
      this.setState({commissionCount: 0});
    }
  }

  private async provideCommissions(offset?: number, size?: number): Promise<WithSize<Commission>> {
    let number = +this.props.match!.params.number;
    let response = await this.request("fetchCommissions", {number, offset, size});
    if (response.status === 200 && !("error" in response.data)) {
      let hitResult = response.data;
      return hitResult;
    } else {
      return [[], 0];
    }
  }

  private async checkAuthorization(): Promise<void> {
    let number = +this.props.match!.params.number;
    let authority = "own" as const;
    let response = await this.request("checkDictionaryAuthorization", {number, authority});
    if (response.status === 200) {
      this.setState({authorized: true});
    }
  }

  private renderChangeDictionaryNameForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryNameForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionaryNameForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionaryNameForm
          number={this.state.dictionary!.number}
          currentName={this.state.dictionary!.name}
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryParamNameForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryParamNameForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionaryParamNameForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionaryParamNameForm
          number={this.state.dictionary!.number}
          currentParamName={this.state.dictionary!.paramName}
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionarySecretForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionarySecretForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionarySecretForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionarySecretForm
          number={this.state.dictionary!.number}
          currentSecret={this.state.dictionary!.secret}
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryExplanationForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryExplanationForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionaryExplanationForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description} forceWide={true}>
        <ChangeDictionaryExplanationForm
          number={this.state.dictionary!.number}
          currentExplanation={this.state.dictionary!.explanation}
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryAkrantiainSourceForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryAkrantiainSourceForm.label");
    let description = <Markdown source={this.trans("dictionarySettingPage.changeDictionaryAkrantiainSourceForm.description")} simple={true}/>;
    let node = (
      <SettingPane label={label} key={label} description={description} forceWide={true}>
        <ChangeDictionarySourceForm
          number={this.state.dictionary!.number}
          currentSource={this.state.dictionary!.settings.akrantiainSource}
          language="akrantiain"
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryZatlinSourceForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryZatlinSourceForm.label");
    let description = <Markdown source={this.trans("dictionarySettingPage.changeDictionaryZatlinSourceForm.description")} simple={true}/>;
    let node = (
      <SettingPane label={label} key={label} description={description} forceWide={true}>
        <ChangeDictionarySourceForm
          number={this.state.dictionary!.number}
          currentSource={this.state.dictionary!.settings.zatlinSource}
          language="zatlin"
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryPronunciationTitleForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryPronunciationTitleForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionaryPronunciationTitleForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionarySettingsForm
          number={this.state.dictionary!.number}
          currentSettings={this.state.dictionary!.settings}
          propertyName="pronunciationTitle"
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryExampleTitleForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryExampleTitleForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionaryExampleTitleForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionarySettingsForm
          number={this.state.dictionary!.number}
          currentSettings={this.state.dictionary!.settings}
          propertyName="exampleTitle"
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryEnableMarkdownForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.changeDictionaryEnableMarkdownForm.label");
    let description = this.trans("dictionarySettingPage.changeDictionaryEnableMarkdownForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionarySettingsForm
          number={this.state.dictionary!.number}
          currentSettings={this.state.dictionary!.settings}
          propertyName="enableMarkdown"
          onSubmit={this.fetchDictionary.bind(this)}
        />
      </SettingPane>
    );
    return node;
  }

  private renderUploadDictionaryForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.uploadDictionaryForm.label");
    let description = this.trans("dictionarySettingPage.uploadDictionaryForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <UploadDictionaryForm number={this.state.dictionary!.number}/>
      </SettingPane>
    );
    return node;
  }

  private renderDiscardDictionaryForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.discardDictionaryForm.label");
    let description = this.trans("dictionarySettingPage.discardDictionaryForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <DiscardDictionaryForm number={this.state.dictionary!.number} onSubmit={() => this.pushPath("/dashboard", {}, true)}/>
      </SettingPane>
    );
    return node;
  }

  private renderCommissionList(): ReactNode {
    let node = (
      <SettingPane key="commissionList">
        <CommissionList commissions={this.provideCommissions.bind(this)} dictionary={this.state.dictionary!} size={30} onDiscardConfirm={this.fetchCommissionCount.bind(this)}/>
      </SettingPane>
    );
    return node;
  }

  private renderResourceList(): ReactNode {
    let node = (
      <SettingPane key="resourceList">
        <ResourceList dictionary={this.state.dictionary!} size={20}/>
      </SettingPane>
    );
    return node;
  }

  private renderAddEditInvitationForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.addEditInvitationForm.label");
    let description = this.trans("dictionarySettingPage.addEditInvitationForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <AddEditInvitationForm number={this.state.dictionary!.number} dictionary={this.state.dictionary!}/>
      </SettingPane>
    );
    return node;
  }

  private renderAddTransferInvitationForm(): ReactNode {
    let label = this.trans("dictionarySettingPage.addTransferInvitationForm.label");
    let description = this.trans("dictionarySettingPage.addTransferInvitationForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <AddTransferInvitationForm number={this.state.dictionary!.number} dictionary={this.state.dictionary!}/>
      </SettingPane>
    );
    return node;
  }

  private renderHistoryPane(): ReactNode {
    let label = this.trans("dictionarySettingPage.historyPane.label");
    let description = this.trans("dictionarySettingPage.historyPane.description");
    let node = (
      <SettingPane label={label} key={label} description={description} forceWide={true}>
        <HistoryPane dictionary={this.state.dictionary!}/>
      </SettingPane>
    );
    return node;
  }

  private renderWordNameFrequencyPane(): ReactNode {
    let label = this.trans("dictionarySettingPage.wordNameFrequencyPane.label");
    let description = this.trans("dictionarySettingPage.wordNameFrequencyPane.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <WordNameFrequencyPane dictionary={this.state.dictionary!}/>
      </SettingPane>
    );
    return node;
  }

  public render(): ReactNode {
    let number = +this.props.match!.params.number;
    let mode = this.props.match?.params.mode || "general";
    let commissionCount = (this.state.commissionCount > 0) ? this.state.commissionCount : undefined;
    let menuSpecs = [
      {mode: "general", label: this.trans("dictionarySettingPage.general"), iconLabel: "\uF05A", href: "/dashboard/dictionary/" + number},
      {mode: "setting", label: this.trans("dictionarySettingPage.setting"), iconLabel: "\uF013", href: "/dashboard/dictionary/setting/" + number},
      {mode: "access", label: this.trans("dictionarySettingPage.access"), iconLabel: "\uF0C0", href: "/dashboard/dictionary/access/" + number},
      {mode: "request", label: this.trans("dictionarySettingPage.commission"), iconLabel: "\uF022", badgeValue: commissionCount, href: "/dashboard/dictionary/request/" + number},
      {mode: "resource", label: this.trans("dictionarySettingPage.resource"), iconLabel: "\uF15B", href: "/dashboard/dictionary/resource/" + number},
      {mode: "statistics", label: this.trans("dictionarySettingPage.statistics"), iconLabel: "\uF201", href: "/dashboard/dictionary/statistics/" + number}
    ];
    let contentNodes = [];
    if (this.state.dictionary && this.state.authorized) {
      if (mode === "general") {
        contentNodes.push(this.renderChangeDictionaryNameForm());
        contentNodes.push(this.renderChangeDictionaryParamNameForm());
        contentNodes.push(this.renderChangeDictionarySecretForm());
        contentNodes.push(this.renderUploadDictionaryForm());
        contentNodes.push(this.renderDiscardDictionaryForm());
      } else if (mode === "setting") {
        contentNodes.push(this.renderChangeDictionaryExplanationForm());
        contentNodes.push(this.renderChangeDictionaryAkrantiainSourceForm());
        contentNodes.push(this.renderChangeDictionaryZatlinSourceForm());
        contentNodes.push(this.renderChangeDictionaryPronunciationTitleForm());
        contentNodes.push(this.renderChangeDictionaryExampleTitleForm());
        contentNodes.push(this.renderChangeDictionaryEnableMarkdownForm());
      } else if (mode === "access") {
        contentNodes.push(this.renderAddEditInvitationForm());
        contentNodes.push(this.renderAddTransferInvitationForm());
      } else if (mode === "request") {
        contentNodes.push(this.renderCommissionList());
      } else if (mode === "resource") {
        contentNodes.push(this.renderResourceList());
      } else if (mode === "statistics") {
        contentNodes.push(this.renderHistoryPane());
        contentNodes.push(this.renderWordNameFrequencyPane());
      }
    }
    let node = (
      <Page dictionary={this.state.dictionary} showDictionary={true}>
        <Menu mode={mode} specs={menuSpecs}/>
        {contentNodes}
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: EnhancedDictionary | null,
  commissionCount: number,
  authorized: boolean
};
type Params = {
  number: string,
  mode: string
};