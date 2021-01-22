//

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
import Label from "/client/component/atom/label";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./regexp-executor.scss"))
export default class RegexpExecutor extends Component<Props, State> {

  public state: State = {
    source: undefined as any,
    target: "",
    result: {target: "", ranges: []},
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

  private executeRegexp(): void {
    try {
      let regexp = new RegExp(this.state.source, "g");
      let target = this.state.target;
      let match = null as RegExpExecArray | null;
      let result = {target, ranges: []} as HitResult;
      while ((match = regexp.exec(target)) !== null) {
        let start = match.index;
        let end = regexp.lastIndex;
        result.ranges.push({start, end});
      }
      this.setState({result, errorMessage: ""});
    } catch (error) {
      let errorMessage = error.message.trim() ?? "Unknown error";
      this.setState({errorMessage, result: null});
    }
  }

  private handleClose(event: MouseEvent<HTMLElement>): void {
    if (this.props.onClose !== undefined) {
      this.props.onClose(event, this.state.source);
    }
  }

  private renderResult(): ReactNode {
    let innerNodes = [];
    if (this.state.result !== null) {
      let target = this.state.result.target;
      let ranges = this.state.result.ranges;
      let currentIndex = 0;
      innerNodes.push((ranges.length > 0) ? ranges.length.toString() : "No");
      innerNodes.push((ranges.length === 1) ? " match:\n" : " matches:\n");
      if (ranges.length > 0) {
        innerNodes.push("  ");
        for (let index = 0 ; index < ranges.length ; index ++) {
          let range = ranges[index];
          let rangeNode = (
            <span styleName="hit" key={index}>
              {target.substring(range.start, range.end).replaceAll("\n", "\n  ")}
            </span>
          );
          innerNodes.push(target.substring(currentIndex, range.start).replaceAll("\n", "\n  "));
          innerNodes.push(rangeNode);
          currentIndex = range.end;
        }
        innerNodes.push(target.substring(currentIndex, target.length).replace("\n", "\n  "));
      }
    } else {
      innerNodes.push(this.state.errorMessage);
    }
    let node = (
      <div styleName="error-message">
        <Label text={this.trans("regexpExecutor.result")}/>
        <div styleName="result-input">
          {innerNodes}
        </div>
      </div>
    );
    return node;
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let resultNode = this.renderResult();
    let node = (
      <Overlay size="large" title={this.trans("regexpExecutor.title")} open={this.props.open} onClose={this.handleClose.bind(this)}>
        <div styleName="root">
          <TextArea
            className={styles["source"]}
            label={this.trans("regexpExecutor.source")}
            value={this.state.source}
            font="monospace"
            language="regexp"
            nowrap={true}
            fitHeight={true}
            onSet={(source) => this.setState({source})}
          />
          <TextArea
            className={styles["target"]}
            label={this.trans("regexpExecutor.target")}
            value={this.state.target}
            font="monospace"
            language="plain"
            nowrap={true}
            fitHeight={true}
            onSet={(target) => this.setState({target})}
          />
          <Button className={styles["button"]} label={this.trans("regexpExecutor.execute")} onClick={this.executeRegexp.bind(this)}/>
          {resultNode}
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
  target: string,
  result: HitResult | null,
  errorMessage: string
};

export type HitResult = {target: string, ranges: Array<HitRange>};
export type HitRange = {start: number, end: number};