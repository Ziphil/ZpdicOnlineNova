//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Highlight from "/client/component/atom/highlight";
import Component from "/client/component/component";
import AkrantiainExecutor from "/client/component/compound/akrantiain-executor";
import RegexpExecutor from "/client/component/compound/regexp-executor";
import ZatlinExecutor from "/client/component/compound/zatlin-executor";
import {
  style
} from "/client/component/decorator";


@style(require("./source-tester.scss"))
export default class SourceTester extends Component<Props, State> {

  public state: State = {
    executorOpen: false
  };

  private renderExecutor(): ReactNode {
    if (this.props.language === "akrantiain") {
      let node = (
        <AkrantiainExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
      );
      return node;
    } else if (this.props.language === "zatlin") {
      let node = (
        <ZatlinExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
      );
      return node;
    } else if (this.props.language === "regexp") {
      let node = (
        <RegexpExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
      );
      return node;
    } else {
      return undefined;
    }
  }

  public render(): ReactNode {
    let executorNode = this.renderExecutor();
    let node = (
      <Fragment>
        <form styleName="root">
          <Highlight value={this.props.source} language={this.props.language}/>
          <Button label={this.trans("sourceTester.try")} style="link" onClick={() => this.setState({executorOpen: true})}/>
        </form>
        {executorNode}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  source: string,
  language: string
};
type State = {
  executorOpen: boolean
};