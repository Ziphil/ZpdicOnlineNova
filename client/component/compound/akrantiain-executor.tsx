//

import {
  Akrantiain
} from "akrantiain";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./akrantiain-executor.scss"))
export default class AkrantiainExecutor extends Component<Props, State> {

  public state: State = {
    source: undefined as any,
    input: "",
    output: "",
    errorMessage: ""
  };

  public constructor(props: Props) {
    super(props);
    let source = this.props.defaultSource ?? "";
    this.state.source = source;
  }

  private executeAkrantiain(): void {
    try {
      let akrantiain = Akrantiain.load(this.state.source);
      let output = akrantiain.convert(this.state.input);
      this.setState({output, errorMessage: ""});
    } catch (error) {
      let errorMessage = error.message.trim() ?? "Unknown error";
      this.setState({errorMessage, output: ""});
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let node = (
      <Overlay size="large" title={this.trans("akrantiainExecutor.title")} open={this.props.open} onClose={this.props.onClose}>
        <div styleName="root">
          <TextArea
            className={styles["source"]}
            label={this.trans("akrantiainExecutor.source")}
            value={this.state.source}
            font="monospace"
            mode="akrantiain"
            nowrap={true}
            onSet={(source) => this.setState({source})}
          />
          <Input label={this.trans("akrantiainExecutor.input")} value={this.state.input} onSet={(input) => this.setState({input})}/>
          <Button className={styles["button"]} label={this.trans("akrantiainExecutor.execute")} onClick={this.executeAkrantiain.bind(this)}/>
          <Input label={this.trans("akrantiainExecutor.output")} value={this.state.output} readOnly={true}/>
          <TextArea className={styles["error-message"]} label={this.trans("akrantiainExecutor.errorMessage")} value={this.state.errorMessage} font="monospace" nowrap={true} readOnly={true}/>
        </div>
      </Overlay>
    );
    return node;
  }

}


type Props = {
  defaultSource?: string,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>
};
type State = {
  source: string,
  input: string,
  output: string,
  errorMessage: string
};