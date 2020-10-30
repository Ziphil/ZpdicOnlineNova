//

import * as react from "react";
import {
  ElementType,
  ReactElement,
  ReactNode
} from "react";
import ReactMarkdown from "react-markdown";
import {
  NodeType
} from "react-markdown";
import Link from "/client/component/atom/link";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./markdown.scss"))
export default class Markdown extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    simple: false,
    allowHeading: false
  };

  public render(): ReactNode {
    let [allowedTypes, disallowedTypes] = (() => {
      if (this.props.simple) {
        let allowedTypes = ["root", "text", "paragraph", "link"] as Array<NodeType>;
        return [allowedTypes, undefined];
      } else {
        let disallowedTypes = ["thematicBreak", "image", "imageReference", "definition", "heading", "html", "virtualHtml"] as Array<NodeType>;
        if (this.props.allowHeading) {
          disallowedTypes = disallowedTypes.filter((type) => type !== "heading");
        }
        return [undefined, disallowedTypes];
      }
    })();
    let renderers = (() => {
      if (this.props.simple) {
        let simpleRenderer = function (props: any): ReactElement {
          return props.children;
        };
        return {link: Link, root: simpleRenderer, paragraph: simpleRenderer} as Renderers;
      } else {
        return {link: Link} as Renderers;
      }
    })();
    let innerNode = (
      <ReactMarkdown
        className={this.props.className}
        source={this.props.source}
        renderers={renderers}
        allowedTypes={allowedTypes}
        disallowedTypes={disallowedTypes}
      />
    );
    let node = (this.props.simple) ? innerNode : <div styleName="root" className={this.props.className}>{innerNode}</div>;
    return node;
  }

}


type Props = {
  source: string,
  simple: boolean,
  allowHeading: boolean
  className?: string
};
type DefaultProps = {
  simple: boolean,
  allowHeading: boolean
};
type State = {
};

type Renderers = {[type: string]: ElementType};