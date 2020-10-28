//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import {
  ZATLIN_VERSION,
  Zatlin
} from "zatlin";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./zatlin-executor.scss"))
export default class ZatlinExecutor extends Component<Props, State> {

  public state: State = {
    source: undefined as any,
    output: "",
    errorMessage: ""
  };

  public constructor(props: Props) {
    super(props);
    let source = this.props.defaultSource ?? "";
    this.state.source = source;
  }

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.defaultSource !== previousProps.defaultSource) {
      let source = this.props.defaultSource ?? "";
      this.setState({source});
    }
  }

  private executeAkrantiain(): void {
    try {
      let zatlin = Zatlin.load(this.state.source);
      let output = zatlin.generate();
      this.setState({output, errorMessage: ""});
    } catch (error) {
      let errorMessage = error.message.trim() ?? "Unknown error";
      this.setState({errorMessage, output: ""});
    }
  }

  private handleClose(event: MouseEvent<HTMLElement>): void {
    if (this.props.onClose !== undefined) {
      this.props.onClose(event, this.state.source);
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let version = ZATLIN_VERSION;
    let node = (
      <Overlay size="large" title={this.trans("zatlinExecutor.title", {version})} open={this.props.open} onClose={this.handleClose.bind(this)}>
        <div styleName="root">
          <TextArea
            className={styles["source"]}
            label={this.trans("zatlinExecutor.source")}
            value={this.state.source}
            font="monospace"
            mode="zatlin"
            nowrap={true}
            onSet={(source) => this.setState({source})}
          />
          <Button className={styles["button"]} label={this.trans("zatlinExecutor.execute")} onClick={this.executeAkrantiain.bind(this)}/>
          <Input label={this.trans("zatlinExecutor.output")} value={this.state.output} readOnly={true}/>
          <TextArea className={styles["error-message"]} label={this.trans("zatlinExecutor.errorMessage")} value={this.state.errorMessage} font="monospace" nowrap={true} readOnly={true}/>
        </div>
      </Overlay>
    );
    return node;
  }

}


type Props = {
  defaultSource?: string,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>, source: string) => AsyncOrSync<void>
};
type State = {
  source: string,
  output: string,
  errorMessage: string
};