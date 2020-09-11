//

import * as react from "react";
import {
  ReactNode
} from "react";
import * as ReactMarkdown from "react-markdown";
import {
  NodeType
} from "react-markdown";
import {
  Link
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./markdown.scss"))
export class Markdown extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root" className={this.props.className}>
        <ReactMarkdown
          source={this.props.source}
          renderers={{link: Link}}
          disallowedTypes={["thematicBreak", "image", "imageReference", "definition", "heading", "code", "html", "virtualHtml"]}
        />
      </div>
    );
    return node;
  }

}


type Props = {
  source: string,
  className?: string
};
type State = {
};