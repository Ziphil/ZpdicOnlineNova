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
import ZatlinExecutor from "/client/component/compound/zatlin-executor";
import {
  style
} from "/client/component/decorator";


@style(require("./source-tester.scss"))
export default class SourceTester extends Component<Props, State> {

  public state: State = {
    executorOpen: false
  };

  public render(): ReactNode {
    let executorNode = (() => {
      if (this.props.language === "akrantiain") {
        let executorNode = (
          <AkrantiainExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
        );
        return executorNode;
      } else if (this.props.language === "zatlin") {
        let executorNode = (
          <ZatlinExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
        );
        return executorNode;
      }
    })();
    let node = (
      <Fragment>
        <form styleName="root">
          <Highlight value={this.props.source} language={this.props.language}/>
          <Button label={this.trans("sourceTester.try")} onClick={() => this.setState({executorOpen: true})}/>
        </form>
        {executorNode}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  source: string,
  language: "akrantiain" | "zatlin"
};
type State = {
  executorOpen: boolean
};