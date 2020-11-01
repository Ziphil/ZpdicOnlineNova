//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import AkrantiainExecutor from "/client/component/compound/akrantiain-executor";
import ZatlinExecutor from "/client/component/compound/zatlin-executor";
import {
  style
} from "/client/component/decorator";


@style(require("./change-dictionary-source-form.scss"))
export default class ChangeDictionarySourceForm extends Component<Props, State> {

  public state: State = {
    source: undefined as any,
    executorOpen: false
  };

  public constructor(props: any) {
    super(props);
    let source = this.props.currentSource ?? "";
    this.state.source = source;
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let propertyName = this.props.language + "Source";
    let settings = {[propertyName]: this.state.source};
    let response = await this.requestPost("changeDictionarySettings", {number, settings});
    if (response.status === 200) {
      this.props.store!.addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let executorNode = (() => {
      if (this.props.language === "akrantiain") {
        let executorNode = (
          <AkrantiainExecutor defaultSource={this.state.source} open={this.state.executorOpen} onClose={(event, source) => this.setState({source, executorOpen: false})}/>
        );
        return executorNode;
      } else if (this.props.language === "zatlin") {
        let executorNode = (
          <ZatlinExecutor defaultSource={this.state.source} open={this.state.executorOpen} onClose={(event, source) => this.setState({source, executorOpen: false})}/>
        );
        return executorNode;
      }
    })();
    let node = (
      <Fragment>
        <form styleName="root">
          <TextArea
            label={this.trans(`changeDictionarySourceForm.${this.props.language}`)}
            value={this.state.source}
            font="monospace"
            language={this.props.language}
            nowrap={true}
            onSet={(source) => this.setState({source})}
          />
          <div styleName="button">
            <Button label={this.trans("changeDictionarySourceForm.try")} style="link" onClick={() => this.setState({executorOpen: true})}/>
            <Button label={this.trans("changeDictionarySourceForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
          </div>
        </form>
        {executorNode}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentSource: string | undefined,
  language: "akrantiain" | "zatlin",
  onSubmit?: () => void
};
type State = {
  source: string,
  executorOpen: boolean
};