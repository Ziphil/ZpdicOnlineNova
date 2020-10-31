//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


require("akrantiain/dist/code-mirror/mode");
require("zatlin/dist/code-mirror/mode");
require("codemirror/mode/markdown/markdown");


@style(require("./highlight.scss"))
export default class Highlight extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    value: ""
  };

  public render(): ReactNode {
    let styles = this.props.styles!;
    let textAreaClassName = StyleNameUtil.create(styles["textarea"], this.props.className);
    let modeOptions = (() => {
      if (this.props.mode === "markdown") {
        return {theme: "zpmarkdown", mode: {name: "markdown", xml: false, fencedCodeBlockHighlighting: false}};
      } else if (this.props.mode === "akrantiain") {
        return {theme: "zpakrantiain", mode: {name: "akrantiain"}};
      } else if (this.props.mode === "zatlin") {
        return {theme: "zpakrantiain", mode: {name: "zatlin"}};
      } else {
        return {theme: "zpplain", mode: undefined};
      }
    })();
    let otherOptions = {viewportMargin: 1 / 0, readOnly: true, lineWrapping: false};
    let options = {...modeOptions, ...otherOptions};
    let node = (
      <div styleName="root">
        <CodeMirror className={textAreaClassName} value={this.props.value} options={options} onBeforeChange={() => null}/>
      </div>
    );
    return node;
  }

}


type Props = {
  value: string,
  mode: string,
  className?: string
};
type DefaultProps = {
  value: string
};
type State = {
};