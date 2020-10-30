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


@style(require("./source-tester.scss"))
export default class SourceTester extends Component<Props, State> {

  public state: State = {
    executorOpen: false
  };

  public render(): ReactNode {
    let executorNode = (() => {
      if (this.props.languageName === "akrantiain") {
        let executorNode = (
          <AkrantiainExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
        );
        return executorNode;
      } else if (this.props.languageName === "zatlin") {
        let executorNode = (
          <ZatlinExecutor defaultSource={this.props.source} open={this.state.executorOpen} onClose={() => this.setState({executorOpen: false})}/>
        );
        return executorNode;
      }
    })();
    let node = (
      <Fragment>
        <form styleName="root">
          <TextArea
            value={this.props.source}
            font="monospace"
            mode={this.props.languageName}
            nowrap={true}
            readOnly={true}
          />
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
  languageName: "akrantiain" | "zatlin"
};
type State = {
  executorOpen: boolean
};